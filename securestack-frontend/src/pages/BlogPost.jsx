import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';
import NotFound from './NotFound';
import { blogPosts } from '../data/blogData';
import './Blog.css';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const isLocalDev = API_URL.includes('localhost') || API_URL.includes('127.0.0.1');

      if (!isLocalDev) {
        const localPost = blogPosts.find(p => p.slug === slug);
        setPost(localPost || null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/social/blog/${slug}/`);
        setPost(response.data);
      } catch (err) {
        console.error('Failed to fetch blog detail from API, trying local fallback:', err);
        const localPost = blogPosts.find(p => p.slug === slug);
        setPost(localPost || null);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [slug]);

  if (loading) {
    return (
      <main className="post-page-root">
        <article className="post-container">
          <header className="post-header">
            <Link to="/blog" className="post-back-btn" style={{ marginBottom: '24px' }}>
              ← Back to Articles
            </Link>
            <div className="skeleton-line skeleton-badge"></div>
            <div className="skeleton-line skeleton-title" style={{ height: '40px', width: '90%' }}></div>
            <div className="skeleton-line skeleton-title" style={{ height: '40px', width: '60%', marginBottom: '20px' }}></div>
            <div className="skeleton-line skeleton-badge" style={{ width: '200px' }}></div>
          </header>
          <div className="post-content">
            <div className="skeleton-line" style={{ height: '16px', width: '100%', marginBottom: '16px' }}></div>
            <div className="skeleton-line" style={{ height: '16px', width: '100%', marginBottom: '16px' }}></div>
            <div className="skeleton-line" style={{ height: '16px', width: '85%', marginBottom: '32px' }}></div>
            
            <div className="skeleton-line" style={{ height: '28px', width: '40%', marginBottom: '20px' }}></div>
            <div className="skeleton-line" style={{ height: '16px', width: '100%', marginBottom: '16px' }}></div>
            <div className="skeleton-line" style={{ height: '16px', width: '90%', marginBottom: '16px' }}></div>
          </div>
        </article>
      </main>
    );
  }

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
