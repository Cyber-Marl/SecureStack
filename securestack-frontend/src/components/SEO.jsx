import { useEffect } from 'react';

/**
 * SEO Component
 * 
 * Dynamically updates document metadata in <head> for search engines
 * and social previews without external package dependencies.
 * 
 * @param {Object} props
 * @param {string} props.title - Page title (appended with ' | SecureStack')
 * @param {string} props.description - Page description meta tag content
 * @param {string} props.keywords - Comma-separated SEO keyword list
 * @param {string} props.path - Route path (e.g. "/services") for canonical and OG URLs
 */
export default function SEO({ title, description, keywords, path = '' }) {
  useEffect(() => {
    // 1. Format and Update Document Title
    const baseTitle = 'SecureStack — Cybersecurity & Software Development';
    const formattedTitle = title ? `${title} | SecureStack` : baseTitle;
    document.title = formattedTitle;

    // 2. Format and Update Meta Description
    const defaultDesc = "SecureStack Enterprise Solutions — Empowering your business through secure software development, cybersecurity, and cloud solutions in Zimbabwe and Africa.";
    const descriptionContent = description || defaultDesc;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', descriptionContent);

    // 3. Format and Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    } else if (metaKeywords) {
      metaKeywords.remove(); // Remove tag if page doesn't define any keywords
    }

    // 4. Update Open Graph Tags (Social Shares)
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', formattedTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', descriptionContent);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', `https://securestack.co.zw${path}`);

    // 5. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `https://securestack.co.zw${path}`);

  }, [title, description, keywords, path]);

  return null;
}
