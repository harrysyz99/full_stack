import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    marketAttitude: ''
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        marketAttitude: user.marketAttitude || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.updateProfile(formData);
      updateUser(response.data);
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
        <h1>My Profile</h1>

        {message && (
          <div className={message.includes('success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}

        {editing ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                minLength="3"
                maxLength="30"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                maxLength="500"
                placeholder="Tell us about yourself..."
                style={{ minHeight: '100px' }}
              />
            </div>

            <div className="form-group">
              <label>Market Attitude</label>
              <select
                value={formData.marketAttitude}
                onChange={(e) => setFormData({ ...formData, marketAttitude: e.target.value })}
              >
                <option value="">Not specified</option>
                <option value="bullish">Bullish 📈</option>
                <option value="bearish">Bearish 📉</option>
                <option value="neutral">Neutral ➡️</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#667eea' }}>{user?.username}</h3>
              <p style={{ color: '#666' }}>{user?.email}</p>
              {user?.bio && <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>{user.bio}</p>}
              {user?.marketAttitude && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Market Attitude: </strong>
                  <span className={`attitude-badge ${user.marketAttitude}`}>
                    {user.marketAttitude}
                  </span>
                </div>
              )}
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#999' }}>
                Member since: {new Date(user?.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button onClick={() => setEditing(true)} className="btn btn-primary">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
