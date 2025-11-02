const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const { analyzePortfolio, updateStockPrices } = require('../services/portfolioService');

const router = express.Router();

// @route   GET /api/portfolios/me
// @desc    Get current user's portfolio
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.userId });

    if (!portfolio) {
      // Create default portfolio if none exists
      portfolio = new Portfolio({
        user: req.userId,
        name: 'My Portfolio',
        holdings: []
      });
      await portfolio.save();
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/portfolios/me
// @desc    Update portfolio
// @access  Private
router.put('/me', auth, [
  body('name').optional().trim().isLength({ max: 100 }),
  body('description').optional().isLength({ max: 500 }),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, isPublic, holdings } = req.body;

    let portfolio = await Portfolio.findOne({ user: req.userId });

    if (!portfolio) {
      portfolio = new Portfolio({ user: req.userId });
    }

    if (name) portfolio.name = name;
    if (description !== undefined) portfolio.description = description;
    if (isPublic !== undefined) portfolio.isPublic = isPublic;
    if (holdings) portfolio.holdings = holdings;

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/portfolios/me/holdings
// @desc    Add holding to portfolio
// @access  Private
router.post('/me/holdings', auth, [
  body('symbol').notEmpty().trim().toUpperCase(),
  body('name').notEmpty().trim(),
  body('quantity').isFloat({ min: 0 }),
  body('avgCost').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { symbol, name, quantity, avgCost } = req.body;

    let portfolio = await Portfolio.findOne({ user: req.userId });

    if (!portfolio) {
      portfolio = new Portfolio({ user: req.userId });
    }

    // Check if holding already exists
    const existingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);

    if (existingIndex > -1) {
      // Update existing holding
      portfolio.holdings[existingIndex].quantity += quantity;
      portfolio.holdings[existingIndex].avgCost =
        ((portfolio.holdings[existingIndex].avgCost * portfolio.holdings[existingIndex].quantity) + (avgCost * quantity)) /
        (portfolio.holdings[existingIndex].quantity + quantity);
    } else {
      // Add new holding
      portfolio.holdings.push({
        symbol,
        name,
        quantity,
        avgCost,
        currentPrice: avgCost,
        lastUpdated: new Date()
      });
    }

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    console.error('Add holding error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/portfolios/me/holdings/:symbol
// @desc    Remove holding from portfolio
// @access  Private
router.delete('/me/holdings/:symbol', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.userId });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    portfolio.holdings = portfolio.holdings.filter(
      h => h.symbol !== req.params.symbol.toUpperCase()
    );

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/portfolios/me/analyze
// @desc    Analyze portfolio and get AI insights
// @access  Private
router.post('/me/analyze', auth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.userId });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Update stock prices
    await updateStockPrices(portfolio);

    // Analyze portfolio
    const analysis = await analyzePortfolio(portfolio);

    portfolio.analytics = {
      diversificationScore: analysis.diversificationScore,
      riskLevel: analysis.riskLevel,
      recommendations: analysis.recommendations,
      lastAnalyzed: new Date()
    };

    await portfolio.save();

    res.json({
      portfolio,
      analysis
    });
  } catch (error) {
    console.error('Portfolio analysis error:', error);
    res.status(500).json({ error: 'Server error during analysis' });
  }
});

module.exports = router;
