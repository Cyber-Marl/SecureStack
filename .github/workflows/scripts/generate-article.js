/**
 * generate-article.js
 *
 * Called by the GitHub Actions scheduled workflow.
 * Generates a new cybersecurity/dev blog article via Gemini AI
 * and prepends it to securestack-frontend/src/data/blogData.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BLOG_DATA_PATH = path.join(__dirname, '../../../securestack-frontend/src/data/blogData.js');

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is not set.');
  process.exit(1);
}

// Rotate topics based on current week number so each week is different
const topics = [
  {
    key: 'cybersecurity',
    label: 'Cybersecurity',
    prompt: 'A detailed article explaining a security vulnerability or defensive strategy (e.g., DNSSEC, TLS 1.3, certificate pinning, zero-trust architecture, API authentication security, rate limiting, CSRF protection, clickjacking prevention, Content Security Policy).'
  },
  {
    key: 'development',
    label: 'Development',
    prompt: 'An article detailing modern software development best practices (e.g., building scalable REST APIs, writing clean/maintainable code, secure coding principles in Django/React, managing third-party dependency risks, input validation, error handling patterns).'
  },
  {
    key: 'cloud_devops',
    label: 'Cloud & DevOps',
    prompt: 'An article detailing cloud security, server virtualization, or automation (e.g., securing Docker container deployments, writing secure Terraform files, setting up safe CI/CD pipelines, IAM architecture on AWS, Kubernetes secrets management).'
  }
];

const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
const topic = topics[weekNumber % topics.length];

console.log(`Selected topic: ${topic.label}`);

const prompt = `
You are the Lead Developer and Cybersecurity Advocate for "SecureStack Enterprise Solutions" (website: https://securestack.co.zw).
Write a high-quality, comprehensive, and highly engaging technical blog post.

Topic details: ${topic.prompt}

Requirements:
1. Make it detailed, clear, and extremely practical. Include actionable code examples or config blocks where appropriate.
2. Structure the body content using valid clean HTML tags: <h2>, <h3>, <p>, <ul>, <li>, and <code> or <pre> for code snippets. Do not use <h1>.
3. The content must be professional, authoritative, and developer-friendly.
4. Conclude the post with a brief call to action pointing to SecureStack's services (e.g. domain audits, security consultations at securestack.co.zw).
5. Generate appropriate SEO metadata: a custom SEO Title, a short excerpt (1-2 sentences), a meta description (under 160 characters), and relevant keywords.

You MUST format your response as a valid JSON object with ONLY these exact fields:
{
  "title": "A compelling, SEO-friendly title",
  "excerpt": "A short 1-2 sentence excerpt summarizing the post",
  "category": "One of: 'Cybersecurity', 'Development', or 'Cloud & DevOps'",
  "tags": "3-4 comma-separated tags relevant to the post",
  "read_time": "Estimated reading time (e.g., '6 min read')",
  "seo_title": "SEO Title tag (e.g. 'How to Secure X | SecureStack')",
  "seo_desc": "SEO Meta Description (under 160 characters)",
  "keywords": "3-5 comma-separated keywords",
  "content": "Full body content using valid HTML tags (h2, h3, p, ul, li, pre, code). Escape all double quotes inside this string."
}

Output ONLY the raw JSON. No markdown code blocks or extra text.
`;

function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Gemini API error ${res.statusCode}: ${data}`));
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const text = parsed.candidates[0].content.parts[0].text.trim();
          resolve(text);
        } catch (e) {
          reject(new Error(`Failed to parse Gemini response: ${e.message}\nRaw: ${data.slice(0, 500)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(90000, () => {
      req.destroy(new Error('Gemini API request timed out after 90s'));
    });
    req.write(body);
    req.end();
  });
}

function parseGeminiJson(rawText) {
  // Strategy 1: direct parse
  try { return JSON.parse(rawText); } catch (_) {}

  // Strategy 2: isolate the JSON block
  const start = rawText.indexOf('{');
  const end = rawText.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in Gemini response');
  let jsonStr = rawText.slice(start, end + 1);

  // Strategy 3: fix bare newlines/tabs inside all string values using a state machine
  let result = '';
  let inString = false;
  let escape = false;
  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];
    if (escape) {
      result += ch;
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      result += ch;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }
    if (inString) {
      // Escape any bare control characters inside strings
      if (ch === '\n') { result += '\\n'; continue; }
      if (ch === '\r') { result += '\\r'; continue; }
      if (ch === '\t') { result += '\\t'; continue; }
    }
    result += ch;
  }

  try { return JSON.parse(result); } catch (e) {
    throw new Error(`JSON parse failed after sanitization: ${e.message}\nSanitized excerpt: ${result.slice(14300, 14600)}`);
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
}

function buildArticleEntry(data, slug) {
  const tagsArray = data.tags.split(',').map(t => t.trim()).filter(Boolean);
  const tagsJson = JSON.stringify(tagsArray);
  // Escape backticks in content to safely embed in template literal
  const safeContent = data.content.replace(/`/g, '\\`').replace(/\${/g, '\\${');

  return `  {
    slug: '${slug}',
    title: ${JSON.stringify(data.title)},
    excerpt: ${JSON.stringify(data.excerpt)},
    date: '${formatDate(new Date())}',
    author: 'SecureStack Research Team',
    readTime: ${JSON.stringify(data.read_time)},
    category: ${JSON.stringify(data.category)},
    tags: ${tagsJson},
    seoTitle: ${JSON.stringify(data.seo_title)},
    seoDesc: ${JSON.stringify(data.seo_desc)},
    keywords: ${JSON.stringify(data.keywords)},
    content: \`${safeContent}\`
  }`;
}

async function main() {
  console.log('Calling Gemini AI to generate article...');
  const rawText = await callGemini(prompt);

  console.log('Parsing response...');
  const articleData = parseGeminiJson(rawText);

  const slug = slugify(articleData.title);
  console.log(`Generated: "${articleData.title}"`);
  console.log(`Slug: ${slug}`);

  // Read existing blogData.js
  const existingContent = fs.readFileSync(BLOG_DATA_PATH, 'utf8');

  // Check if slug already exists (avoid duplicates)
  if (existingContent.includes(`slug: '${slug}'`)) {
    console.log('Article with this slug already exists — skipping.');
    process.exit(0);
  }

  // Build the new article entry
  const newEntry = buildArticleEntry(articleData, slug);

  // Inject after "export const blogPosts = [" on the first line
  const insertMarker = 'export const blogPosts = [';
  const insertIndex = existingContent.indexOf(insertMarker) + insertMarker.length;

  const updatedContent =
    existingContent.slice(0, insertIndex) +
    '\n' + newEntry + ',\n' +
    existingContent.slice(insertIndex);

  fs.writeFileSync(BLOG_DATA_PATH, updatedContent, 'utf8');

  console.log(`SUCCESS: Article injected into blogData.js`);
  console.log(`Title: ${articleData.title}`);
  console.log(`Category: ${articleData.category}`);

  // Write a summary for the commit message
  fs.writeFileSync(
    path.join(process.cwd(), 'generated_article_summary.txt'),
    `${articleData.title}|||${slug}|||${articleData.category}`
  );
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
