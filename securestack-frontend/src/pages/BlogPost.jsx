import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import NotFound from './NotFound';
import { blogPosts } from '../data/blogData';
import './Blog.css';

export default function BlogPost() {
  const { slug } = useParams();

  // Find the post
  const post = blogPosts.find(p => p.slug === slug);

  // If no post is found, render the 404 page directly
  if (!post) {
    return <NotFound />;
  }

  return (
    <main className="post-page-root">
      <SEO 
        title={post.seoTitle || post.title} 
        description={post.seoDesc || post.excerpt} 
        keywords={post.keywords} 
        path={`/blog/${post.slug}`} 
      />

      <article className="post-container">
        {/* Post Header */}
        <header className="post-header">
          <Link to="/blog" className="post-back-btn" style={{ marginBottom: '24px' }}>
            ← Back to Articles
          </Link>
          
          <div>
            <span className="post-category-tag">{post.category}</span>
          </div>

          <h1 className="post-title">{post.title}</h1>
          
          <div className="post-meta-bar">
            <span>By <strong>{post.author}</strong></span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span>Published on {post.date}</span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Post Body Content */}
        <div 
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Post Footer Nav */}
        <footer className="post-footer">
          <Link to="/blog" className="post-back-btn">
            ← Back to Articles List
          </Link>
          <Link to="/contact" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>
            Discuss a Project
          </Link>
        </footer>
      </article>
    </main>
  );
}
