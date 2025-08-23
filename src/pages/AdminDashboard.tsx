import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data for dashboard
  const stats = [
    { title: 'Total Users', value: '2,540', icon: 'fas fa-users', color: '#007bff' },
    { title: 'New Users', value: '120', icon: 'fas fa-user-plus', color: '#28a745' },
    { title: 'Total Shops', value: '656', icon: 'fas fa-shopping-cart', color: '#ffc107' },
    { title: 'Total Orders', value: '9,540', icon: 'fas fa-box', color: '#dc3545' },
    { title: 'Pending Orders', value: '100', icon: 'fas fa-clock', color: '#6c757d' },
    { title: 'Online Orders', value: '8,540', icon: 'fas fa-globe', color: '#17a2b8' }
  ];

  const quickLinks = [
    { title: 'Dashboard', icon: 'fas fa-tachometer-alt', color: '#007bff', path: '/admin' },
    { title: 'Users', icon: 'fas fa-users', color: '#28a745', path: '/admin/users' },
    { title: 'Orders', icon: 'fas fa-shopping-bag', color: '#ffc107', path: '/admin/orders' },
    { title: 'Products', icon: 'fas fa-box', color: '#dc3545', path: '/admin/products' },
    { title: 'Analytics', icon: 'fas fa-chart-line', color: '#17a2b8', path: '/admin/analytics' },
    { title: 'Settings', icon: 'fas fa-cog', color: '#6c757d', path: '/admin/settings' }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar collapsed={sidebarCollapsed} />
      
      <div className={`admin-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <AdminHeader 
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          user={user}
        />
        
        <div className="admin-content">
          {/* Breadcrumb */}
          <div className="admin-breadcrumb">
            <h1>Dashboard</h1>
            <div className="breadcrumb-path">Home &gt; Dashboard</div>
          </div>

          {/* Quick Links */}
          <div className="quick-links-section">
            <div className="quick-links-grid">
              {quickLinks.map((link, index) => (
                <div key={index} className="quick-link-card" style={{ borderLeftColor: link.color }}>
                  <div className="quick-link-icon" style={{ backgroundColor: link.color }}>
                    <i className={link.icon}></i>
                  </div>
                  <div className="quick-link-content">
                    <h3>{link.title}</h3>
                    <p>Manage {link.title.toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics and Analytics */}
          <div className="analytics-section">
            <div className="analytics-main">
              <div className="analytics-card">
                <div className="analytics-header">
                  <h3>Site Analysis</h3>
                  <p>Overview of Latest Month</p>
                </div>
                <div className="analytics-chart">
                  {/* Placeholder for chart */}
                  <div className="chart-placeholder">
                    <div className="chart-line chart-line-1"></div>
                    <div className="chart-line chart-line-2"></div>
                    <div className="chart-points">
                      {Array.from({ length: 12 }, (_, i) => (
                        <div key={i} className="chart-point" style={{ left: `${(i / 11) * 100}%` }}></div>
                      ))}
                    </div>
                    <div className="chart-labels">
                      <span>0</span>
                      <span>3</span>
                      <span>6</span>
                      <span>9</span>
                      <span>11</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-section">
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                      <i className={stat.icon}></i>
                    </div>
                    <div className="stat-content">
                      <h4>{stat.value}</h4>
                      <p>{stat.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Activity */}
          <div className="activity-section">
            <div className="activity-card">
              <h3>Latest Posts</h3>
              <div className="activity-item">
                <div className="activity-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="activity-content">
                  <h4>James Anderson</h4>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
                </div>
              </div>
            </div>

            <div className="activity-card">
              <h3>Recent Activity</h3>
              <div className="activity-item">
                <div className="activity-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="activity-content">
                  <h4>Sarah Johnson</h4>
                  <p>New order #12345 has been placed successfully...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
