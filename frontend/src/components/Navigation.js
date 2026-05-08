import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut, FiHome, FiDollarSign, FiTrendingUp, FiPieChart, FiUpload } from 'react-icons/fi';
import '../styles/Navigation.css';

function Navigation({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">💰 Smart Budget</div>
          <div className="nav-right">
            <span className="user-info">Hello, {user?.username}</span>
            <button className="btn-logout" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="sidebar">
        <div className="sidebar-menu">
          <a
            href="/"
            className={`menu-item ${isActive('/')}`}
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
          >
            <FiHome className="menu-icon" />
            <span>Dashboard</span>
          </a>
          <a
            href="/income"
            className={`menu-item ${isActive('/income')}`}
            onClick={(e) => { e.preventDefault(); navigate('/income'); }}
          >
            <FiDollarSign className="menu-icon" />
            <span>Income</span>
          </a>
          <a
            href="/expense"
            className={`menu-item ${isActive('/expense')}`}
            onClick={(e) => { e.preventDefault(); navigate('/expense'); }}
          >
            <FiTrendingUp className="menu-icon" />
            <span>Expenses</span>
          </a>
          <a
            href="/budget"
            className={`menu-item ${isActive('/budget')}`}
            onClick={(e) => { e.preventDefault(); navigate('/budget'); }}
          >
            <FiPieChart className="menu-icon" />
            <span>Budget</span>
          </a>
          <a
            href="/analytics"
            className={`menu-item ${isActive('/analytics')}`}
            onClick={(e) => { e.preventDefault(); navigate('/analytics'); }}
          >
            <FiTrendingUp className="menu-icon" />
            <span>Analytics</span>
          </a>
          <a
            href="/import"
            className={`menu-item ${isActive('/import')}`}
            onClick={(e) => { e.preventDefault(); navigate('/import'); }}
          >
            <FiUpload className="menu-icon" />
            <span>Import</span>
          </a>
        </div>
      </div>
    </>
  );
}

export default Navigation;