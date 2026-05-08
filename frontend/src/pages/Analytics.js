import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Analytics.css';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

function Analytics() {
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [categoryTrends, setCategoryTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#330867'];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [categoryRes, monthlyRes, trendsRes] = await Promise.all([
        api.get('/analytics/expenses-by-category'),
        api.get('/analytics/monthly-expenses'),
        api.get('/analytics/category-trends')
      ]);

      setExpensesByCategory(categoryRes.data.data);
      setMonthlyExpenses(monthlyRes.data.data);
      setCategoryTrends(trendsRes.data.data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value: parseFloat(value)
    }));
  };

  const prepareLineChartData = () => {
    return Object.entries(monthlyExpenses).map(([month, amount]) => ({
      month,
      amount: parseFloat(amount)
    }));
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Financial Analytics</h1>
        <button className="btn-refresh" onClick={fetchAnalytics}>🔄 Refresh</button>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Expenses by Category</h2>
          {Object.keys(expensesByCategory).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={prepareChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {prepareChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No expense data available</p>
          )}
        </div>

        <div className="chart-card">
          <h2>Monthly Spending Trend</h2>
          {Object.keys(monthlyExpenses).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={prepareLineChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#667eea"
                  strokeWidth={2}
                  dot={{ fill: '#667eea', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No monthly data available</p>
          )}
        </div>
      </div>

      <div className="trends-card">
        <h2>Category Breakdown</h2>
        {categoryTrends && categoryTrends.length > 0 ? (
          <div className="trends-table">
            <div className="table-header">
              <div>Category</div>
              <div>Total Spent</div>
              <div>Transactions</div>
            </div>
            {categoryTrends.map((trend, index) => (
              <div key={index} className="table-row">
                <div>{trend.category}</div>
                <div className="amount">${parseFloat(trend.total).toFixed(2)}</div>
                <div>{trend.count}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No category data available</p>
        )}
      </div>
    </div>
  );
}

export default Analytics;