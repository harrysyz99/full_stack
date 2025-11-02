import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>AI-Oriented Trading Platform</h1>
          <p className="subtitle">
            Discuss strategies, share portfolios, and get AI-powered insights
          </p>
          <div className="cta-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/posts" className="btn btn-primary">
                  View Discussion Board
                </Link>
                <Link to="/portfolio" className="btn btn-secondary">
                  My Portfolio
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Platform Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Discussion Board</h3>
              <p>Share your market insights and discuss strategies with the community</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Portfolio Management</h3>
              <p>Track your holdings and get detailed performance analytics</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Insights</h3>
              <p>Get stock recommendations and sentiment analysis powered by AI</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📰</div>
              <h3>Market News</h3>
              <p>Stay updated with the latest financial news and market trends</p>
            </div>
          </div>
        </div>
      </section>

      <section className="timeline">
        <div className="container">
          <h2>Development Timeline</h2>
          <div className="timeline-items">
            <div className="timeline-item">
              <div className="timeline-date">MVP - Nov 7, 2025</div>
              <div className="timeline-content">
                <h4>Proof of Concept</h4>
                <p>Basic forum, user authentication, and post creation</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">Alpha - Nov 19, 2025</div>
              <div className="timeline-content">
                <h4>Core Features</h4>
                <p>Portfolio management, sentiment analysis, and responsive UI</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">Beta - Nov 28, 2025</div>
              <div className="timeline-content">
                <h4>Feature Complete</h4>
                <p>News API, AI recommendations, and admin tools</p>
              </div>
            </div>
            <div className="timeline-item active">
              <div className="timeline-date">Final - Dec 10, 2025</div>
              <div className="timeline-content">
                <h4>Production Ready</h4>
                <p>Polished UI, bug fixes, and comprehensive documentation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
