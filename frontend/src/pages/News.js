import React, { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNews();
  }, [query]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsAPI.getNews({ query });
      setNews(response.data.articles || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchTerm);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1>Market News</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news... (e.g., AAPL, Tesla, crypto)"
            style={{ flex: 1, padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '6px' }}
          />
          <button type="submit" className="btn btn-primary">Search</button>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSearchTerm('');
              }}
              className="btn btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="loading">Loading news...</div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {news.map((article, idx) => (
            <div key={idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#333', textDecoration: 'none' }}
                >
                  {article.title}
                </a>
              </h3>
              <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                {article.source?.name} • {new Date(article.publishedAt).toLocaleDateString()}
              </div>
              <p style={{ color: '#666', lineHeight: '1.6' }}>{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ marginTop: '1rem', display: 'inline-block' }}
              >
                Read More →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
