const axios = require('axios');

/**
 * Update stock prices for portfolio holdings
 * @param {Object} portfolio - Portfolio document
 */
const updateStockPrices = async (portfolio) => {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (!apiKey) {
      console.warn('Alpha Vantage API key not configured. Using mock prices.');
      // Use mock prices
      portfolio.holdings.forEach(holding => {
        holding.currentPrice = holding.avgCost * (1 + (Math.random() * 0.2 - 0.1));
        holding.lastUpdated = new Date();
      });
      return;
    }

    // Update each holding (with rate limiting)
    for (const holding of portfolio.holdings) {
      try {
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: holding.symbol,
            apikey: apiKey
          }
        });

        const quote = response.data['Global Quote'];
        if (quote && quote['05. price']) {
          holding.currentPrice = parseFloat(quote['05. price']);
          holding.lastUpdated = new Date();
        }

        // Rate limiting - Alpha Vantage free tier: 5 calls/minute
        await new Promise(resolve => setTimeout(resolve, 12000));
      } catch (error) {
        console.error(`Error fetching price for ${holding.symbol}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Update stock prices error:', error);
  }
};

/**
 * Analyze portfolio and provide insights
 * @param {Object} portfolio - Portfolio document
 * @returns {Object} Analysis results
 */
const analyzePortfolio = async (portfolio) => {
  try {
    const analysis = {
      diversificationScore: 0,
      riskLevel: 'medium',
      recommendations: [],
      sectorAllocation: {},
      topPerformers: [],
      underperformers: []
    };

    if (!portfolio.holdings || portfolio.holdings.length === 0) {
      return {
        ...analysis,
        recommendations: ['Start by adding some holdings to your portfolio']
      };
    }

    // Calculate sector allocation
    portfolio.holdings.forEach(holding => {
      const sector = classifySector(holding.symbol);
      if (!analysis.sectorAllocation[sector]) {
        analysis.sectorAllocation[sector] = 0;
      }
      const value = holding.quantity * holding.currentPrice;
      analysis.sectorAllocation[sector] += value;
    });

    // Calculate diversification score (0-100)
    const numSectors = Object.keys(analysis.sectorAllocation).length;
    const numHoldings = portfolio.holdings.length;
    analysis.diversificationScore = Math.min(100, (numSectors * 20) + (Math.min(numHoldings, 10) * 5));

    // Determine risk level
    const techAllocation = (analysis.sectorAllocation['Technology'] || 0) / portfolio.totalValue;
    if (techAllocation > 0.6 || numHoldings < 5) {
      analysis.riskLevel = 'high';
    } else if (numHoldings > 10 && techAllocation < 0.3) {
      analysis.riskLevel = 'low';
    }

    // Find top performers and underperformers
    const performanceData = portfolio.holdings.map(holding => ({
      symbol: holding.symbol,
      return: ((holding.currentPrice - holding.avgCost) / holding.avgCost) * 100
    })).sort((a, b) => b.return - a.return);

    analysis.topPerformers = performanceData.slice(0, 3);
    analysis.underperformers = performanceData.slice(-3).reverse();

    // Generate recommendations
    if (analysis.diversificationScore < 50) {
      analysis.recommendations.push('Increase diversification by adding stocks from different sectors');
    }

    if (numHoldings < 5) {
      analysis.recommendations.push('Consider adding more holdings to reduce concentration risk');
    }

    if (techAllocation > 0.5) {
      analysis.recommendations.push('High tech allocation detected. Consider balancing with defensive sectors');
    }

    const avgReturn = performanceData.reduce((sum, h) => sum + h.return, 0) / performanceData.length;
    if (avgReturn < -5) {
      analysis.recommendations.push('Portfolio showing negative returns. Review underperforming stocks');
    }

    return analysis;
  } catch (error) {
    console.error('Portfolio analysis error:', error);
    return {
      diversificationScore: 0,
      riskLevel: 'unknown',
      recommendations: ['Unable to analyze portfolio at this time'],
      error: error.message
    };
  }
};

// Helper function
const classifySector = (symbol) => {
  const tech = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'AMD', 'TSLA', 'SQ', 'COIN'];
  const finance = ['JPM', 'BAC', 'GS', 'MS', 'C', 'WFC', 'V', 'MA'];
  const healthcare = ['JNJ', 'UNH', 'PFE', 'ABBV', 'TMO', 'DHR'];
  const consumer = ['PG', 'KO', 'PEP', 'WMT', 'HD', 'MCD', 'NKE'];
  const energy = ['XOM', 'CVX', 'COP', 'SLB'];
  const utilities = ['NEE', 'DUK', 'SO', 'D'];

  if (tech.includes(symbol)) return 'Technology';
  if (finance.includes(symbol)) return 'Finance';
  if (healthcare.includes(symbol)) return 'Healthcare';
  if (consumer.includes(symbol)) return 'Consumer';
  if (energy.includes(symbol)) return 'Energy';
  if (utilities.includes(symbol)) return 'Utilities';
  return 'Other';
};

module.exports = {
  updateStockPrices,
  analyzePortfolio
};
