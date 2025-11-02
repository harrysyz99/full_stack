import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPost(id);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await postsAPI.likePost(id);
      fetchPost();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await postsAPI.addComment(id, { content: comment });
      setComment('');
      fetchPost();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(id);
        navigate('/posts');
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return <div className="error">Post not found</div>;

  const isAuthor = user && post.author._id === user.id;

  return (
    <div className="post-detail container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
      <div className="post-content" style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h1>{post.title}</h1>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className="category-badge">{post.category}</span>
          {post.sentiment?.analyzed && (
            <span className="sentiment-badge" style={{ backgroundColor: post.sentiment.label === 'positive' ? '#4caf50' : post.sentiment.label === 'negative' ? '#f44336' : '#9e9e9e' }}>
              {post.sentiment.label}
            </span>
          )}
        </div>
        <div style={{ color: '#666', marginBottom: '1rem' }}>
          By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{post.content}</div>

        {post.stocks && post.stocks.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            {post.stocks.map((stock, idx) => (
              <span key={idx} className="stock-tag" style={{ marginRight: '0.5rem' }}>${stock.symbol}</span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
          <button onClick={handleLike} className="btn btn-secondary">
            👍 Like ({post.likes?.length || 0})
          </button>
          {isAuthor && (
            <button onClick={handleDelete} className="btn" style={{ background: '#f44336', color: 'white' }}>
              Delete Post
            </button>
          )}
        </div>
      </div>

      <div className="comments" style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
        <h3>Comments ({post.comments?.length || 0})</h3>

        {user && (
          <form onSubmit={handleComment} style={{ marginBottom: '2rem' }}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '6px', minHeight: '100px' }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Post Comment</button>
          </form>
        )}

        <div>
          {post.comments?.map((comment, idx) => (
            <div key={idx} style={{ padding: '1rem', borderBottom: '1px solid #e0e0e0', marginBottom: '1rem' }}>
              <div style={{ fontWeight: '600', color: '#667eea', marginBottom: '0.5rem' }}>
                {comment.author.username}
              </div>
              <div>{comment.content}</div>
              <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
