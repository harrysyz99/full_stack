const express = require('express');
const axios = require('axios');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/news
// @desc    Get financial news
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { query, category, page } = req.query;

    const params = {
      apiKey: process.env.NEWS_API_KEY,
      language: 'en',
      pageSize: 20,
      page: page || 1
    };

    let endpoint = 'everything';

    if (query) {
      params.q = query;
    } else if (category === 'business' || category === 'technology') {
      endpoint = 'top-headlines';
      params.category = category;
      params.country = 'us';
    } else {
      // Default to financial/business news
      params.q = 'stock market OR finance OR trading';
      params.sortBy = 'publishedAt';
    }

    const response = await axios.get(
      `${process.env.NEWS_API_URL || 'https://newsapi.org/v2'}/${endpoint}`,
      { params }
    );

    res.json({
      articles: response.data.articles,
      totalResults: response.data.totalResults
    });
  } catch (error) {
    console.error('News API error:', error.response?.data || error.message);

    // Return mock data if API fails
    res.json({
      articles: [
        {
          title: 'Sample Market News - API Key Required',
          description: 'Please configure NEWS_API_KEY in .env file to fetch real news.',
          url: 'https://newsapi.org',
          publishedAt: new Date().toISOString(),
          source: { name: 'System' }
        }
      ],
      totalResults: 1
    });
  }
});

// @route   GET /api/news/stock/:symbol
// @desc    Get news for specific stock
// @access  Private
router.get('/stock/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params;

    const response = await axios.get(
      `${process.env.NEWS_API_URL || 'https://newsapi.org/v2'}/everything`,
      {
        params: {
          apiKey: process.env.NEWS_API_KEY,
          q: symbol,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 10
        }
      }
    );

    res.json({
      symbol,
      articles: response.data.articles,
      totalResults: response.data.totalResults
    });
  } catch (error) {
    console.error('Stock news error:', error.response?.data || error.message);

    res.json({
      symbol: req.params.symbol,
      articles: [
        {
          title: `Sample News for ${req.params.symbol}`,
          description: 'Please configure NEWS_API_KEY in .env file to fetch real news.',
          url: 'https://newsapi.org',
          publishedAt: new Date().toISOString(),
          source: { name: 'System' }
        }
      ],
      totalResults: 1
    });
  }
});

module.exports = router;
