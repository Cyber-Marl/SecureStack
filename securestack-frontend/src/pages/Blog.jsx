import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogData';
import './Blog.css';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  // Categorization
  const categories = ['All', 'Cybersecurity', 'Development', 'Cloud & DevOps'];

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <main>
      <SEO 
        title="Resources, Audits & Tech Insights" 
        description="Stay informed with SecureStack's technical resources: Cybersecurity guidelines, software engineering best practices, DMARC configurations, and cloud security checklists."
        keywords="cybersecurity blog Zimbabwe, software engineering insights, cloud migration checklist, DMARC guide"
        path="/blog"
      />

      {/* ── Page Hero ── */}
      <section className="blog-hero-section">
        <div className="container">
          <div className="svc-breadcrumbs">
            <Link to="/">Home</Link>
            <span className="svc-breadcrumb-sep">&gt;</span>
            <span className="svc-breadcrumb-active">Blog &amp; Resources Center</span>
          </div>
          <h1 className="svc-main-title">Resources &amp; Technical Insights</h1>
          <p className="blog-hero-subtitle">
            SecureStack's engineering and research logs. Read our latest articles covering offensive cybersecurity, serverless deployment, compliance standards, and custom web application design.
          </p>
        </div>
      </section>

      {/* ── Blog Grid Section ── */}
      <section className="section" style={{ paddingTop: '64px' }}>
        <div className="container">
          {/* Category Selector */}
          <div className="blog-filters">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`blog-filter-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>
              No articles found in this category.
            </div>
          ) : (
            <div className="blog-grid">
              {filteredPosts.map(post => (
                <article key={post.slug} className="blog-post-card card">
                  <div className="blog-card-category">{post.category}</div>
                  
                  <Link to={`/blog/${post.slug}`}>
                    <h3>{post.title}</h3>
                  </Link>

                  <p className="blog-card-excerpt">{post.excerpt}</p>

                  <div className="blog-card-meta">
                    <span>{post.date}</span>
                    <span className="blog-card-meta-dot"></span>
                    <span>{post.readTime}</span>
                  </div>

                  <div className="blog-card-footer">
                    <span className="blog-card-author">By {post.author.split(',')[0]}</span>
                    <Link to={`/blog/${post.slug}`} className="blog-card-readmore">
                      Read Article ➔
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
