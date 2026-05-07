import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboard(response.data);
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <p>Here's your financial overview</p>
      </div>

      {dashboard && (
        <>
          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">Total Income</div>
              <div className="card-amount income">
                ${dashboard.totalIncome?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="card">
              <div className="card-header">Total Expenses</div>
              <div className="card-amount expense">
                ${dashboard.totalExpenses?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="card">
              <div className="card-header">Balance</div>
              <div className={`card-amount ${dashboard.balance >= 0 ? 'balance-positive' : 'balance-negative'}`}>
                ${dashboard.balance?.toFixed(2) || '0.00'}
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="section">
              <h2>Recent Expenses</h2>
              {dashboard.recentExpenses && dashboard.recentExpenses.length > 0 ? (
                <div className="table">
                  <div className="table-header">
                    <div>Category</div>
                    <div>Amount</div>
                    <div>Date</div>
                  </div>
                  {dashboard.recentExpenses.map(expense => (
                    <div key={expense.id} className="table-row">
                      <div>{expense.category}</div>
                      <div className="amount">${expense.amount?.toFixed(2)}</div>
                      <div>{new Date(expense.expenseDate).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">No recent expenses</p>
              )}
            </div>

            <div className="section">
              <h2>Recent Income</h2>
              {dashboard.recentIncome && dashboard.recentIncome.length > 0 ? (
                <div className="table">
                  <div className="table-header">
                    <div>Source</div>
                    <div>Amount</div>
                    <div>Date</div>
                  </div>
                  {dashboard.recentIncome.map(income => (
                    <div key={income.id} className="table-row">
                      <div>{income.source}</div>
                      <div className="amount">${income.amount?.toFixed(2)}</div>
                      <div>{new Date(income.incomeDate).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">No recent income</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;