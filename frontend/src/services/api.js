import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  getUserById: (id) => api.get(`/users/${id}`),
  getUserPortfolio: (id) => api.get(`/users/${id}/portfolio`)
};

// Posts API
export const postsAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
  addComment: (id, data) => api.post(`/posts/${id}/comment`, data)
};

// Portfolio API
export const portfolioAPI = {
  getMyPortfolio: () => api.get('/portfolios/me'),
  updatePortfolio: (data) => api.put('/portfolios/me', data),
  addHolding: (data) => api.post('/portfolios/me/holdings', data),
  removeHolding: (symbol) => api.delete(`/portfolios/me/holdings/${symbol}`),
  analyzePortfolio: () => api.post('/portfolios/me/analyze')
};

// AI API
export const aiAPI = {
  analyzeSentiment: (text) => api.post('/ai/sentiment', { text }),
  getRecommendations: (data) => api.post('/ai/recommendations', data),
  getMarketSentiment: () => api.get('/ai/market-sentiment')
};

// News API
export const newsAPI = {
  getNews: (params) => api.get('/news', { params }),
  getStockNews: (symbol) => api.get(`/news/stock/${symbol}`)
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  pinPost: (id) => api.put(`/admin/posts/${id}/pin`),
  lockPost: (id) => api.put(`/admin/posts/${id}/lock`),
  deletePost: (id) => api.delete(`/admin/posts/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role })
};

export default api;
