import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Budget.css';

function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Other',
    limitAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const categories = ['Groceries', 'Restaurants', 'Utilities', 'Entertainment', 'Healthcare', 'Transportation', 'Shopping', 'Fitness', 'Travel', 'Other'];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get(`/budgets/user/${user.userId}`);
      setBudgets(response.data);
    } catch (err) {
      setError('Failed to load budget data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        await api.put(`/budgets/${editingId}`, {
          ...formData,
          limitAmount: parseFloat(formData.limitAmount),
          user: { id: user.userId }
        });
      } else {
        await api.post('/budgets', {
          ...formData,
          limitAmount: parseFloat(formData.limitAmount),
          user: { id: user.userId }
        });
      }
      fetchBudgets();
      setShowForm(false);
      setFormData({
        category: 'Other',
        limitAmount: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      });
      setEditingId(null);
    } catch (err) {
      setError('Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (err) {
        setError('Failed to delete budget');
      }
    }
  };

  const handleEdit = (budget) => {
    setFormData(budget);
    setEditingId(budget.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      category: 'Other',
      limitAmount: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  return (
    <div className="budget-container">
      <div className="budget-header">
        <h1>Budget Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create Budget'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Budget Limit</label>
              <input
                type="number"
                name="limitAmount"
                value={formData.limitAmount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="budget-list">
        {budgets && budgets.length > 0 ? (
          <div className="budget-grid">
            {budgets.map(budget => (
              <div key={budget.id} className="budget-card">
                <div className="card-header">
                  <h3>{budget.category}</h3>
                  <div className="card-actions">
                    <button className="btn-edit" onClick={() => handleEdit(budget)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(budget.id)}>Delete</button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="budget-amount">Limit: ${parseFloat(budget.limitAmount).toFixed(2)}</div>
                  <div className="budget-period">
                    {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">No budgets yet. Create your first budget!</p>
        )}
      </div>
    </div>
  );
}

export default Budget;