import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import './Posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', page: 1 });

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts(filter);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentBadge = (sentiment) => {
    if (!sentiment || !sentiment.analyzed) return null;
    const colorMap = {
      positive: '#4caf50',
      negative: '#f44336',
      neutral: '#9e9e9e'
    };
    return (
      <span
        className="sentiment-badge"
        style={{ backgroundColor: colorMap[sentiment.label] }}
      >
        {sentiment.label}
      </span>
    );
  };

  return (
    <div className="posts-page">
      <div className="container">
        <div className="posts-header">
          <h1>Discussion Board</h1>
          <Link to="/create-post" className="btn btn-primary">+ New Post</Link>
        </div>

        <div className="filters">
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value, page: 1 })}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="discussion">Discussion</option>
            <option value="portfolio">Portfolio</option>
            <option value="strategy">Strategy</option>
            <option value="news">News</option>
            <option value="question">Question</option>
            <option value="analysis">Analysis</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : (
          <div className="posts-list">
            {posts.length === 0 ? (
              <div className="no-posts">
                <p>No posts yet. Be the first to start a discussion!</p>
                <Link to="/create-post" className="btn btn-primary">Create Post</Link>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="post-card">
                  {post.isPinned && <span className="pinned-badge">📌 Pinned</span>}
                  <div className="post-header">
                    <Link to={`/posts/${post._id}`} className="post-title">
                      <h3>{post.title}</h3>
                    </Link>
                    <div className="post-meta">
                      <span className="category-badge">{post.category}</span>
                      {getSentimentBadge(post.sentiment)}
                    </div>
                  </div>
                  <p className="post-excerpt">
                    {post.content.substring(0, 200)}
                    {post.content.length > 200 ? '...' : ''}
                  </p>
                  <div className="post-footer">
                    <div className="author-info">
                      <span className="author-name">{post.author?.username}</span>
                      {post.author?.marketAttitude && (
                        <span className={`attitude-badge ${post.author.marketAttitude}`}>
                          {post.author.marketAttitude}
                        </span>
                      )}
                    </div>
                    <div className="post-stats">
                      <span>👍 {post.likes?.length || 0}</span>
                      <span>💬 {post.comments?.length || 0}</span>
                      <span>👁️ {post.views || 0}</span>
                    </div>
                  </div>
                  {post.stocks && post.stocks.length > 0 && (
                    <div className="post-stocks">
                      {post.stocks.map((stock, idx) => (
                        <span key={idx} className="stock-tag">${stock.symbol}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
