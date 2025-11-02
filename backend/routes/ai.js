const express = require('express');
const { auth } = require('../middleware/auth');
const { analyzeSentiment, getStockRecommendations, analyzeMarketSentiment } = require('../services/aiService');

const router = express.Router();

// @route   POST /api/ai/sentiment
// @desc    Analyze text sentiment
// @access  Private
router.post('/sentiment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const sentiment = await analyzeSentiment(text);
    res.json(sentiment);
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// @route   POST /api/ai/recommendations
// @desc    Get AI stock recommendations
// @access  Private
router.post('/recommendations', auth, async (req, res) => {
  try {
    const { portfolio, riskTolerance, marketAttitude } = req.body;

    const recommendations = await getStockRecommendations({
      portfolio,
      riskTolerance: riskTolerance || 'moderate',
      marketAttitude: marketAttitude || 'neutral'
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// @route   GET /api/ai/market-sentiment
// @desc    Get overall market sentiment analysis
// @access  Private
router.get('/market-sentiment', auth, async (req, res) => {
  try {
    const sentiment = await analyzeMarketSentiment();
    res.json(sentiment);
  } catch (error) {
    console.error('Market sentiment error:', error);
    res.status(500).json({ error: 'Failed to analyze market sentiment' });
  }
});

module.exports = router;
