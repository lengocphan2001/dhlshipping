import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

interface AdminSidebarProps {
  collapsed: boolean;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      path: '/admin'
    },
    {
      id: 'charts',
      title: 'Charts',
      icon: 'fas fa-chart-bar',
      children: [
        { id: 'line-charts', title: 'Line Charts', icon: 'fas fa-chart-line', path: '/admin/charts/line' },
        { id: 'bar-charts', title: 'Bar Charts', icon: 'fas fa-chart-bar', path: '/admin/charts/bar' },
        { id: 'pie-charts', title: 'Pie Charts', icon: 'fas fa-chart-pie', path: '/admin/charts/pie' }
      ]
    },
    {
      id: 'widgets',
      title: 'Widgets',
      icon: 'fas fa-th',
      path: '/admin/widgets'
    },
    {
      id: 'tables',
      title: 'Tables',
      icon: 'fas fa-table',
      children: [
        { id: 'basic-tables', title: 'Basic Tables', icon: 'fas fa-table', path: '/admin/tables/basic' },
        { id: 'data-tables', title: 'Data Tables', icon: 'fas fa-table', path: '/admin/tables/data' }
      ]
    },
    {
      id: 'forms',
      title: 'Forms',
      icon: 'fas fa-file-alt',
      children: [
        { id: 'basic-forms', title: 'Basic Forms', icon: 'fas fa-file-alt', path: '/admin/forms/basic' },
        { id: 'advanced-forms', title: 'Advanced Forms', icon: 'fas fa-file-alt', path: '/admin/forms/advanced' }
      ]
    },
    {
      id: 'users',
      title: 'Users',
      icon: 'fas fa-users',
      path: '/admin/users'
    },
    {
      id: 'orders',
      title: 'Orders',
      icon: 'fas fa-shopping-bag',
      path: '/admin/orders'
    },
    {
      id: 'products',
      title: 'Products',
      icon: 'fas fa-box',
      path: '/admin/products'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: 'fas fa-chart-line',
      path: '/admin/analytics'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'fas fa-cog',
      path: '/admin/settings'
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isExpanded = (itemId: string) => {
    return expandedItems.includes(itemId);
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.path);
    const expanded = isExpanded(item.id);

    return (
      <div key={item.id} className="sidebar-item">
        {hasChildren ? (
          <div 
            className={`sidebar-link ${expanded ? 'expanded' : ''}`}
            onClick={() => toggleExpanded(item.id)}
          >
            <div className="sidebar-icon">
              <i className={item.icon}></i>
            </div>
            {!collapsed && (
              <>
                <span className="sidebar-title">{item.title}</span>
                <i className={`fas fa-chevron-right sidebar-arrow ${expanded ? 'rotated' : ''}`}></i>
              </>
            )}
          </div>
        ) : (
          <Link 
            to={item.path || '#'} 
            className={`sidebar-link ${active ? 'active' : ''}`}
          >
            <div className="sidebar-icon">
              <i className={item.icon}></i>
            </div>
            {!collapsed && <span className="sidebar-title">{item.title}</span>}
          </Link>
        )}

        {hasChildren && expanded && !collapsed && (
          <div className="sidebar-submenu">
            {item.children!.map(child => (
              <Link
                key={child.id}
                to={child.path || '#'}
                className={`sidebar-submenu-link ${isActive(child.path) ? 'active' : ''}`}
              >
                <div className="sidebar-submenu-icon">
                  <i className={child.icon}></i>
                </div>
                <span className="sidebar-submenu-title">{child.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <i className="fas fa-cube"></i>
            <span>Matrix Admin</span>
          </div>
        )}
        {collapsed && (
          <div className="sidebar-logo-collapsed">
            <i className="fas fa-cube"></i>
          </div>
        )}
      </div>

      <div className="sidebar-menu">
        {menuItems.map(renderMenuItem)}
      </div>

      <div className="sidebar-footer">
        {!collapsed && (
          <button className="download-btn">
            <i className="fas fa-download"></i>
            <span>Download Free</span>
          </button>
        )}
        {collapsed && (
          <button className="download-btn-collapsed">
            <i className="fas fa-download"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
