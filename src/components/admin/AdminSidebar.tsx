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
      id: 'users',
      title: 'Người dùng',
      icon: 'fas fa-users',
      path: '/admin/users'
    },
    {
      id: 'vips',
      title: 'VIPs',
      icon: 'fas fa-gem',
      path: '/admin/vips'
    },
    {
      id: 'orders',
      title: 'Đơn hàng',
      icon: 'fas fa-plane',
      path: '/admin/orders'
    },
    {
      id: 'order-history',
      title: 'Lịch sử đơn hàng',
      icon: 'fas fa-history',
      path: '/admin/order-history'
    },
    {
      id: 'betting-sessions',
      title: 'Phiên cược',
      icon: 'fas fa-dice',
      path: '/admin/betting-sessions'
    },
    {
      id: 'betting-history',
      title: 'Lịch sử cược',
      icon: 'fas fa-chart-line',
      path: '/admin/betting-history'
    },
    {
      id: 'withdrawal-requests',
      title: 'Yêu cầu rút tiền',
      icon: 'fas fa-bell',
      path: '/admin/withdrawal-requests'
    },
    {
      id: 'withdrawal-history',
      title: 'Lịch sử rút tiền',
      icon: 'fas fa-history',
      path: '/admin/withdrawal-history'
    },
    {
      id: 'deposit-history',
      title: 'Lịch sử nạp tiền',
      icon: 'fas fa-history',
      path: '/admin/deposit-history'
    },
         {
       id: 'products',
       title: 'Quản lý Sản phẩm',
       icon: 'fas fa-store',
       path: '/admin/products'
     },
     {
       id: 'reviews',
       title: 'Quản lý Đánh giá',
       icon: 'fas fa-star',
       path: '/admin/reviews'
     },
    {
      id: 'payment-config',
      title: 'Cấu hình thanh toán',
      icon: 'fas fa-cog',
      path: '/admin/payment-config'
    },
    {
      id: 'website-config',
      title: 'Cấu hình trang web',
      icon: 'fas fa-cog',
      path: '/admin/website-config'
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
            <div className="logo-icon">
              <div className="logo-square logo-square-1"></div>
              <div className="logo-square logo-square-2"></div>
              <div className="logo-square logo-square-3"></div>
              <div className="logo-square logo-square-4"></div>
            </div>
            <span className="logo-text">Matrix Admin</span>
          </div>
        )}
        {collapsed && (
          <div className="sidebar-logo-collapsed">
            <div className="logo-icon">
              <div className="logo-square logo-square-1"></div>
              <div className="logo-square logo-square-2"></div>
              <div className="logo-square logo-square-3"></div>
              <div className="logo-square logo-square-4"></div>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-menu">
        {menuItems.map(renderMenuItem)}
      </div>
    </div>
  );
};

export default AdminSidebar;
