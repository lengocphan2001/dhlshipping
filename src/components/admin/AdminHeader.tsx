import React, { useState } from 'react';
import './AdminHeader.css';

interface User {
  id: string;
  username: string;
  email?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  onLogout: () => void;
  user: User;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar, onLogout, user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleCreateMenu = () => {
    setShowCreateMenu(!showCreateMenu);
  };

  return (
    <div className="admin-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        
        <div className="header-logo">
          <i className="fas fa-cube"></i>
          <span>Matrix Admin</span>
        </div>
      </div>

      <div className="header-center">
        <div className="create-dropdown">
          <button className="create-btn" onClick={toggleCreateMenu}>
            <i className="fas fa-plus"></i>
            <span>Create New</span>
            <i className="fas fa-chevron-down"></i>
          </button>
          
          {showCreateMenu && (
            <div className="create-menu">
              <div className="create-menu-item">
                <i className="fas fa-user"></i>
                <span>New User</span>
              </div>
              <div className="create-menu-item">
                <i className="fas fa-shopping-bag"></i>
                <span>New Order</span>
              </div>
              <div className="create-menu-item">
                <i className="fas fa-box"></i>
                <span>New Product</span>
              </div>
              <div className="create-menu-item">
                <i className="fas fa-file-alt"></i>
                <span>New Report</span>
              </div>
            </div>
          )}
        </div>

        <div className="header-search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button className="action-btn notification-btn">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
          
          <button className="action-btn chat-btn">
            <i className="fas fa-comment"></i>
            <span className="chat-badge">5</span>
          </button>
        </div>

        <div className="user-menu">
          <button className="user-btn" onClick={toggleUserMenu}>
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <i className="fas fa-chevron-down"></i>
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-dropdown-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="user-dropdown-info">
                  <span className="user-dropdown-name">{user.username}</span>
                  <span className="user-dropdown-email">{user.email || 'No email'}</span>
                </div>
              </div>
              
              <div className="user-dropdown-menu">
                <div className="dropdown-item">
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </div>
                <div className="dropdown-item">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </div>
                <div className="dropdown-item">
                  <i className="fas fa-question-circle"></i>
                  <span>Help</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={onLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
