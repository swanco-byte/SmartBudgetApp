
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Income.css';

function Income() {
  const [incomes, setIncomes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    incomeDate: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await api.get(`/income/user/${user.userId}`);
      setIncomes(response.data);
    } catch (err) {
      setError('Failed to load income data');
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
        await api.put(`/income/${editingId}`, {
          ...formData,
          amount: parseFloat(formData.amount),
          user: { id: user.userId }
        });
      } else {
        await api.post('/income', {
          ...formData,
          amount: parseFloat(formData.amount),
          user: { id: user.userId }
        });
      }
      fetchIncomes();
      setShowForm(false);
      setFormData({
        amount: '',
        source: '',
        incomeDate: new Date().toISOString().split('T')[0]
      });
      setEditingId(null);
    } catch (err) {
      setError('Failed to save income');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/income/${id}`);
        fetchIncomes();
      } catch (err) {
        setError('Failed to delete income');
      }
    }
  };

  const handleEdit = (income) => {
    setFormData(income);
    setEditingId(income.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      amount: '',
      source: '',
      incomeDate: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  return (
    <div className="income-container">
      <div className="income-header">
        <h1>Income Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Income'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Source</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="e.g., Salary, Freelance, Bonus"
                required
              />
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
                name="incomeDate"
                value={formData.incomeDate}
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

      <div className="income-list">
        {incomes && incomes.length > 0 ? (
          <div className="table">
            <div className="table-header">
              <div>Source</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Actions</div>
            </div>
            {incomes.map(income => (
              <div key={income.id} className="table-row">
                <div>{income.source}</div>
                <div className="amount">${parseFloat(income.amount).toFixed(2)}</div>
                <div>{new Date(income.incomeDate).toLocaleDateString()}</div>
                <div className="actions">
                  <button className="btn-edit" onClick={() => handleEdit(income)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(income.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">No income records. Add your first income!</p>
        )}
      </div>
    </div>
  );
}

export default Income;