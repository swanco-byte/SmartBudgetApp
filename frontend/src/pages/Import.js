import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Import.css';

function Import() {
  const [file, setFile] = useState(null);
  const [importType, setImportType] = useState('csv');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [importResult, setImportResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/import/${importType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(response.data.message);
      setImportResult(response.data.data);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Import failed. Please check your file format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-container">
      <div className="import-header">
        <h1>Bank Statement Import</h1>
        <p>Import your bank transactions and we'll automatically categorize them</p>
      </div>

      <div className="import-content">
        <div className="instructions">
          <h2>CSV File Format</h2>
          <p>Your CSV file should have the following columns:</p>
          <pre>
date,description,amount,type
2026-05-01,Salary,5000.00,income
2026-05-02,Grocery Store,150.50,expense
2026-05-03,Electric Bill,120.00,expense
          </pre>
          <p><strong>Note:</strong> Dates should be in YYYY-MM-DD format</p>
        </div>

        <div className="import-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>File Type</label>
              <select value={importType} onChange={(e) => setImportType(e.target.value)}>
                <option value="csv">CSV File</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select File</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                required
              />
              {file && <p className="file-selected">✓ {file.name} selected</p>}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Importing...' : 'Import Transactions'}
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          {importResult && (
            <div className="import-result">
              <div className="result-summary">
                <div className="result-item success">
                  <h3>✓ Successful</h3>
                  <p>{importResult.successCount} transactions imported</p>
                </div>
                {importResult.failureCount > 0 && (
                  <div className="result-item failure">
                    <h3>✗ Failed</h3>
                    <p>{importResult.failureCount} transactions failed</p>
                  </div>
                )}
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="errors-section">
                  <h3>Errors:</h3>
                  <ul>
                    {importResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Import;