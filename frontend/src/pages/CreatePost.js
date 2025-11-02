import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'discussion',
    tags: '',
    stocks: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        stocks: formData.stocks.split(',').map(s => {
          const symbol = s.trim().toUpperCase();
          return symbol ? { symbol, name: symbol } : null;
        }).filter(s => s)
      };

      const response = await postsAPI.createPost(postData);
      navigate(`/posts/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
        <h1>Create New Post</h1>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength="200"
              placeholder="Enter post title"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="discussion">Discussion</option>
              <option value="portfolio">Portfolio</option>
              <option value="strategy">Strategy</option>
              <option value="news">News</option>
              <option value="question">Question</option>
              <option value="analysis">Analysis</option>
            </select>
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              maxLength="5000"
              placeholder="Share your thoughts..."
              style={{ minHeight: '200px' }}
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., investing, stocks, crypto"
            />
          </div>

          <div className="form-group">
            <label>Stock Symbols (comma-separated)</label>
            <input
              type="text"
              name="stocks"
              value={formData.stocks}
              onChange={handleChange}
              placeholder="e.g., AAPL, GOOGL, MSFT"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button type="button" onClick={() => navigate('/posts')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
