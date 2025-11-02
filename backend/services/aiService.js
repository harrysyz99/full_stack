const Sentiment = require('sentiment');
const natural = require('natural');

const sentiment = new Sentiment();

/**
 * Analyze text sentiment using sentiment analysis
 * @param {string} text - Text to analyze
 * @returns {Object} Sentiment analysis result
 */
const analyzeSentiment = async (text) => {
  try {
    const result = sentiment.analyze(text);

    let label = 'neutral';
    if (result.score > 2) {
      label = 'positive';
    } else if (result.score < -2) {
      label = 'negative';
    }

    return {
      score: result.score,
      comparative: result.comparative,
      label,
      analyzed: true,
      tokens: result.tokens,
      words: result.words,
      positive: result.positive,
      negative: result.negative
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return {
      score: 0,
      label: 'neutral',
      analyzed: false
    };
  }
};

/**
 * Get AI-powered stock recommendations
 * @param {Object} params - Parameters for recommendations
 * @returns {Object} Stock recommendations
 */
const getStockRecommendations = async ({ portfolio, riskTolerance, marketAttitude }) => {
  try {
    // Mock recommendations - In production, integrate with OpenAI or custom ML model
    const recommendations = [];

    // Analyze portfolio diversity
    const sectors = {};
    if (portfolio && portfolio.holdings) {
      portfolio.holdings.forEach(holding => {
        // Simple sector classification (in production, use actual sector data)
        const sector = classifySector(holding.symbol);
        sectors[sector] = (sectors[sector] || 0) + 1;
      });
    }

    // Generate recommendations based on diversity and risk
    if (Object.keys(sectors).length < 3) {
      recommendations.push({
        type: 'diversification',
        priority: 'high',
        message: 'Your portfolio lacks diversification. Consider adding stocks from different sectors.',
        suggestedStocks: generateDiversificationSuggestions(sectors, riskTolerance)
      });
    }

    // Risk-based recommendations
    if (riskTolerance === 'conservative') {
      recommendations.push({
        type: 'risk-management',
        priority: 'medium',
        message: 'Consider adding stable dividend-paying stocks for consistent returns.',
        suggestedStocks: ['JNJ', 'PG', 'KO', 'PEP']
      });
    } else if (riskTolerance === 'aggressive') {
      recommendations.push({
        type: 'growth',
        priority: 'medium',
        message: 'Explore high-growth technology and emerging sector stocks.',
        suggestedStocks: ['NVDA', 'AMD', 'TSLA', 'SQ']
      });
    }

    // Market attitude recommendations
    if (marketAttitude === 'bullish') {
      recommendations.push({
        type: 'market-timing',
        priority: 'low',
        message: 'Market sentiment is positive. Consider gradually increasing equity exposure.',
        suggestedStocks: ['SPY', 'QQQ', 'VOO']
      });
    } else if (marketAttitude === 'bearish') {
      recommendations.push({
        type: 'defensive',
        priority: 'high',
        message: 'Market uncertainty detected. Consider defensive stocks and bonds.',
        suggestedStocks: ['XLU', 'XLP', 'TLT', 'GLD']
      });
    }

    return {
      recommendations,
      generatedAt: new Date(),
      disclaimer: 'AI-generated recommendations are for educational purposes only. Always do your own research.'
    };
  } catch (error) {
    console.error('Recommendation error:', error);
    return {
      recommendations: [],
      error: 'Failed to generate recommendations'
    };
  }
};

/**
 * Analyze overall market sentiment
 * @returns {Object} Market sentiment analysis
 */
const analyzeMarketSentiment = async () => {
  try {
    // Mock market sentiment - In production, analyze news, social media, etc.
    const currentSentiment = Math.random() * 2 - 1; // Random between -1 and 1

    let label = 'neutral';
    if (currentSentiment > 0.3) {
      label = 'bullish';
    } else if (currentSentiment < -0.3) {
      label = 'bearish';
    }

    return {
      sentiment: label,
      score: currentSentiment,
      confidence: Math.random() * 0.5 + 0.5, // 50-100% confidence
      indicators: {
        socialMedia: Math.random() * 2 - 1,
        news: Math.random() * 2 - 1,
        technicalAnalysis: Math.random() * 2 - 1
      },
      analyzedAt: new Date()
    };
  } catch (error) {
    console.error('Market sentiment error:', error);
    return {
      sentiment: 'neutral',
      score: 0,
      confidence: 0,
      error: 'Failed to analyze market sentiment'
    };
  }
};

// Helper functions

const classifySector = (symbol) => {
  // Simple sector classification - in production, use actual data
  const tech = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'AMD', 'TSLA'];
  const finance = ['JPM', 'BAC', 'GS', 'MS', 'C', 'WFC'];
  const healthcare = ['JNJ', 'UNH', 'PFE', 'ABBV', 'TMO'];
  const consumer = ['PG', 'KO', 'PEP', 'WMT', 'HD', 'MCD'];

  if (tech.includes(symbol)) return 'Technology';
  if (finance.includes(symbol)) return 'Finance';
  if (healthcare.includes(symbol)) return 'Healthcare';
  if (consumer.includes(symbol)) return 'Consumer';
  return 'Other';
};

const generateDiversificationSuggestions = (currentSectors, riskTolerance) => {
  const suggestions = {
    conservative: ['JNJ', 'PG', 'KO', 'VZ'],
    moderate: ['MSFT', 'JPM', 'UNH', 'HD'],
    aggressive: ['NVDA', 'TSLA', 'SQ', 'COIN']
  };

  return suggestions[riskTolerance] || suggestions.moderate;
};

module.exports = {
  analyzeSentiment,
  getStockRecommendations,
  analyzeMarketSentiment
};
