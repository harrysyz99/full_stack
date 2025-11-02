const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: 'My Portfolio',
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  holdings: [{
    symbol: {
      type: String,
      required: true,
      uppercase: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    avgCost: {
      type: Number,
      required: true,
      min: 0
    },
    currentPrice: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  totalValue: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  totalReturn: {
    type: Number,
    default: 0
  },
  returnPercentage: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  analytics: {
    diversificationScore: {
      type: Number,
      default: 0
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', ''],
      default: ''
    },
    recommendations: [String],
    lastAnalyzed: Date
  }
}, {
  timestamps: true
});

// Calculate portfolio metrics before saving
portfolioSchema.pre('save', function(next) {
  let totalCost = 0;
  let totalValue = 0;

  this.holdings.forEach(holding => {
    totalCost += holding.quantity * holding.avgCost;
    totalValue += holding.quantity * (holding.currentPrice || holding.avgCost);
  });

  this.totalCost = totalCost;
  this.totalValue = totalValue;
  this.totalReturn = totalValue - totalCost;
  this.returnPercentage = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
