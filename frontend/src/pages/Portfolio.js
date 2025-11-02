import React, { useState, useEffect } from 'react';
import { portfolioAPI, aiAPI } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showAddHolding, setShowAddHolding] = useState(false);
  const [holdingForm, setHoldingForm] = useState({
    symbol: '',
    name: '',
    quantity: '',
    avgCost: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getMyPortfolio();
      setPortfolio(response.data);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHolding = async (e) => {
    e.preventDefault();
    try {
      await portfolioAPI.addHolding({
        ...holdingForm,
        quantity: parseFloat(holdingForm.quantity),
        avgCost: parseFloat(holdingForm.avgCost)
      });
      setHoldingForm({ symbol: '', name: '', quantity: '', avgCost: '' });
      setShowAddHolding(false);
      fetchPortfolio();
    } catch (error) {
      console.error('Failed to add holding:', error);
    }
  };

  const handleAnalyze = async () => {
    try {
      const response = await portfolioAPI.analyzePortfolio();
      setAnalysis(response.data.analysis);
      fetchPortfolio();
    } catch (error) {
      console.error('Failed to analyze portfolio:', error);
    }
  };

  const getSectorData = () => {
    if (!analysis?.sectorAllocation) return [];
    return Object.entries(analysis.sectorAllocation).map(([name, value]) => ({
      name,
      value
    }));
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>My Portfolio</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setShowAddHolding(!showAddHolding)} className="btn btn-primary">
            + Add Holding
          </button>
          <button onClick={handleAnalyze} className="btn btn-secondary">
            🤖 Analyze with AI
          </button>
        </div>
      </div>

      {showAddHolding && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h3>Add New Holding</h3>
          <form onSubmit={handleAddHolding} className="auth-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Symbol</label>
                <input
                  type="text"
                  value={holdingForm.symbol}
                  onChange={(e) => setHoldingForm({ ...holdingForm, symbol: e.target.value.toUpperCase() })}
                  required
                  placeholder="AAPL"
                />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={holdingForm.name}
                  onChange={(e) => setHoldingForm({ ...holdingForm, name: e.target.value })}
                  required
                  placeholder="Apple Inc."
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  step="0.01"
                  value={holdingForm.quantity}
                  onChange={(e) => setHoldingForm({ ...holdingForm, quantity: e.target.value })}
                  required
                  placeholder="10"
                />
              </div>
              <div className="form-group">
                <label>Average Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={holdingForm.avgCost}
                  onChange={(e) => setHoldingForm({ ...holdingForm, avgCost: e.target.value })}
                  required
                  placeholder="150.00"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Add Holding</button>
              <button type="button" onClick={() => setShowAddHolding(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Total Value</h4>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
            ${portfolio?.totalValue?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Total Return</h4>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: portfolio?.totalReturn >= 0 ? '#4caf50' : '#f44336' }}>
            ${portfolio?.totalReturn?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ color: '#666', marginBottom: '0.5rem' }}>Return %</h4>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: portfolio?.returnPercentage >= 0 ? '#4caf50' : '#f44336' }}>
            {portfolio?.returnPercentage?.toFixed(2) || '0.00'}%
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h2>Holdings</h2>
        {portfolio?.holdings && portfolio.holdings.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Symbol</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Quantity</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Avg Cost</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Current</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Value</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Return</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((holding, idx) => {
                const value = holding.quantity * holding.currentPrice;
                const cost = holding.quantity * holding.avgCost;
                const returnVal = value - cost;
                const returnPct = (returnVal / cost) * 100;

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{holding.symbol}</td>
                    <td style={{ padding: '0.75rem' }}>{holding.name}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{holding.quantity}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>${holding.avgCost.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>${holding.currentPrice.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>${value.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', color: returnVal >= 0 ? '#4caf50' : '#f44336' }}>
                      {returnPct.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No holdings yet. Add your first holding to get started!
          </p>
        )}
      </div>

      {analysis && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
            <h2>AI Analysis</h2>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Diversification Score:</strong> {analysis.diversificationScore}/100
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Risk Level:</strong>{' '}
                <span className={`attitude-badge ${analysis.riskLevel}`}>{analysis.riskLevel}</span>
              </div>
              <div>
                <strong>Recommendations:</strong>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                  {analysis.recommendations?.map((rec, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {getSectorData().length > 0 && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
              <h2>Sector Allocation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getSectorData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getSectorData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
