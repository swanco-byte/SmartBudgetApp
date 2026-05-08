import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Expense.css';

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Other',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0]
  });
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const categories = ['Groceries', 'Restaurants', 'Utilities', 'Entertainment', 'Healthcare', 'Transportation', 'Shopping', 'Fitness', 'Travel', 'Other'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get(`/expenses/user/${user.userId}`);
      setExpenses(response.data);
    } catch (err) {
      setError('Failed to load expense data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescriptionChange = async (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      description: value
    }));

    if (value.length > 2) {
      try {
        const response = await api.post('/suggestions/category', { description: value });
        setSuggestedCategory(response.data.data.suggestedCategory);
      } catch (err) {
        console.error('Error getting suggestion:', err);
      }
    }
  };

  const applySuggestion = () => {
    if (suggestedCategory) {
      setFormData(prev => ({
        ...prev,
        category: suggestedCategory
      }));
      setSuggestedCategory('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, {
          ...formData,
          amount: parseFloat(formData.amount),
          user: { id: user.userId }
        });
      } else {
        await api.post('/expenses', {
          ...formData,
          amount: parseFloat(formData.amount),
          user: { id: user.userId }
        });
      }
      fetchExpenses();
      setShowForm(false);
      setFormData({
        amount: '',
        category: 'Other',
        description: '',
        expenseDate: new Date().toISOString().split('T')[0]
      });
      setEditingId(null);
      setSuggestedCategory('');
    } catch (err) {
      setError('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        setError('Failed to delete expense');
      }
    }
  };

  const handleEdit = (expense) => {
    setFormData(expense);
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      amount: '',
      category: 'Other',
      description: '',
      expenseDate: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setSuggestedCategory('');
  };

  return (
    <div className="expense-container">
      <div className="expense-header">
        <h1>Expense Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleDescriptionChange}
                placeholder="e.g., Starbucks coffee, Gas station"
                required
              />
              {suggestedCategory && (
                <div className="suggestion">
                  <p>Suggested category: <strong>{suggestedCategory}</strong>
                    <button type="button" className="btn-suggestion" onClick={applySuggestion}>
                      Apply
                    </button>
                  </p>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="expense-list">
        {expenses && expenses.length > 0 ? (
          <div className="table">
            <div className="table-header">
              <div>Category</div>
              <div>Description</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Actions</div>
            </div>
            {expenses.map(expense => (
              <div key={expense.id} className="table-row">
                <div>
                  <span className={`category-badge ${expense.category.toLowerCase()}`}>
                    {expense.category}
                  </span>
                </div>
                <div>{expense.description}</div>
                <div className="amount">${parseFloat(expense.amount).toFixed(2)}</div>
                <div>{new Date(expense.expenseDate).toLocaleDateString()}</div>
                <div className="actions">
                  <button className="btn-edit" onClick={() => handleEdit(expense)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(expense.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">No expense records. Add your first expense!</p>
        )}
      </div>
    </div>
  );
}

export default Expense;