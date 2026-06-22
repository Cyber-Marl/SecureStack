import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogData';
import './Blog.css';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categorization
  const categories = ['All', 'Cybersecurity', 'Development', 'Cloud & DevOps'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api';
        const response = await axios.get(`${API_URL}/social/blog/`);
        // If API returns data, use it; otherwise fall back to static dataset
        if (response.data && response.data.length > 0) {
          setPosts(response.data);
        } else {
          console.info('API returned no posts — using local static dataset.');
          setPosts(blogPosts);
        }
      } catch (err) {
        console.error('Failed to fetch blog posts from API, falling back to local dataset:', err);
        setPosts(blogPosts);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(post => post.category === activeCategory);

  if (loading) {
    return (
      <main>
        <SEO 
          title="Resources, Audits & Tech Insights" 
          description="Stay informed with SecureStack's technical resources: Cybersecurity guidelines, software engineering best practices, DMARC configurations, and cloud security checklists."
          keywords="cybersecurity blog Zimbabwe, software engineering insights, cloud migration checklist, DMARC guide"
          path="/blog"
        />

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

        <section className="section" style={{ paddingTop: '64px' }}>
          <div className="container">
            <div className="blog-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`blog-filter-btn${activeCategory === cat ? ' active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="blog-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="blog-post-card card skeleton-card">
                  <div className="skeleton-line skeleton-badge"></div>
                  <div className="skeleton-line skeleton-title"></div>
                  <div className="skeleton-line skeleton-excerpt"></div>
                  <div className="skeleton-line skeleton-excerpt" style={{ width: '70%' }}></div>
                  <div className="skeleton-line skeleton-footer"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

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
