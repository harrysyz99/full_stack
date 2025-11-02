import React, { useState, useEffect } from 'react';
import { adminAPI, postsAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        adminAPI.getStats(),
        postsAPI.getPosts({ limit: 10 })
      ]);
      setStats(statsRes.data);
      setPosts(postsRes.data.posts);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePinPost = async (postId) => {
    try {
      await adminAPI.pinPost(postId);
      fetchData();
    } catch (error) {
      console.error('Failed to pin post:', error);
    }
  };

  const handleLockPost = async (postId) => {
    try {
      await adminAPI.lockPost(postId);
      fetchData();
    } catch (error) {
      console.error('Failed to lock post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await adminAPI.deletePost(postId);
        fetchData();
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Total Users</h4>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
            {stats?.stats?.totalUsers || 0}
          </div>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Total Posts</h4>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
            {stats?.stats?.totalPosts || 0}
          </div>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Active Posts</h4>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4caf50' }}>
            {stats?.stats?.activePosts || 0}
          </div>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Deleted Posts</h4>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f44336' }}>
            {stats?.stats?.deletedPosts || 0}
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h2>Recent Users</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Username</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentUsers?.map((user, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '0.75rem' }}>{user.username}</td>
                <td style={{ padding: '0.75rem' }}>{user.email}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span className="category-badge">{user.role}</span>
                </td>
                <td style={{ padding: '0.75rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
        <h2>Manage Posts</h2>
        <div style={{ marginTop: '1rem' }}>
          {posts.map((post) => (
            <div
              key={post._id}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{post.title}</h4>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  by {post.author?.username} • {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handlePinPost(post._id)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  {post.isPinned ? '📌 Unpin' : 'Pin'}
                </button>
                <button
                  onClick={() => handleLockPost(post._id)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  {post.isLocked ? '🔓 Unlock' : '🔒 Lock'}
                </button>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="btn"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#f44336', color: 'white' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
