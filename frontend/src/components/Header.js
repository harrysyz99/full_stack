import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>AI Trading Platform</h1>
        </Link>

        <nav className="nav">
          <Link to="/posts" className="nav-link">Discussion Board</Link>
          {isAuthenticated && (
            <>
              <Link to="/portfolio" className="nav-link">Portfolio</Link>
              <Link to="/news" className="nav-link">News</Link>
              <Link to="/create-post" className="nav-link btn-primary">+ New Post</Link>
            </>
          )}
        </nav>

        <div className="user-section">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' || user?.role === 'moderator' ? (
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              ) : null}
              <Link to="/profile" className="nav-link">
                {user?.username}
              </Link>
              <button onClick={logout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
