import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NavItemId } from '../../types';
import { NAV_ITEMS } from '../../constants/navigation';
import './BottomNavigation.css';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavClick = (itemId: NavItemId) => {
    // Map navigation items to routes
    switch (itemId) {
      case 'home':
        navigate('/');
        break;
      case 'import':
        if (isAuthenticated) {
          navigate('/import');
        } else {
          navigate('/login');
        }
        break;
      case 'export':
        if (isAuthenticated) {
          navigate('/export');
        } else {
          navigate('/login');
        }
        break;
      case 'account':
        if (isAuthenticated) {
          navigate('/profile');
        } else {
          navigate('/login');
        }
        break;
      default:
        navigate('/');
    }
  };

  const getActiveItem = (): NavItemId => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'home';
      case '/import':
        return 'import';
      case '/export':
        return 'export';
      case '/profile':
      case '/login':
      case '/register':
        return 'account';
      default:
        return 'home';
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <i className="fa-solid fa-house fs-6"></i>;
      case 'import':
        return <i className="fa-solid fa-circle-plus fs-6"></i>;
      case 'export':
        return <i className="fa-solid fa-truck-fast fs-6"></i>;
      case 'account':
        return <i className="fa-solid fa-circle-user fs-6"></i>;
      default:
        return null;
    }
  };

  const activeItem = getActiveItem();

  return (
    <nav className="bottom-navigation">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
          onClick={() => handleNavClick(item.id as NavItemId)}
        >
          <div className="nav-icon">
            {getIcon(item.icon)}
          </div>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavigation;
