import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MobileMenu from './MobileMenu';
import ServiceDropdown from './ServiceDropdown';
import logoImage from '../../assets/images/logo.png';
import './Header.css';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleServiceMouseEnter = () => {
    setIsServiceDropdownOpen(true);
  };

  const handleServiceMouseLeave = () => {
    setIsServiceDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { label: 'TRANG CHỦ', path: '/' },
    { label: 'GIỚI THIỆU', path: '/about' },
    { label: 'DỊCH VỤ', path: '/services', hasDropdown: true },
    { label: 'TIN TỨC', path: '/news' },
    { label: 'HÀNG ORDER', path: '/order' },
    { label: 'TRACKING', path: '/tracking' }
  ];

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Desktop Layout */}
          <div className="header-top">
            {/* Logo and Navigation Group */}
            <div className="logo-nav-group">
              {/* DHL Logo */}
              <div className="logo-section">
                <Link to="/" className="dhl-logo">
                  <img src={logoImage} alt="DHL Logo" className="logo-image" />
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="nav-section">
                {navItems.map((item, index) => (
                  <div 
                    key={index} 
                    className={`nav-item-wrapper ${item.hasDropdown ? 'has-dropdown' : ''}`}
                    onMouseEnter={item.hasDropdown ? handleServiceMouseEnter : undefined}
                    onMouseLeave={item.hasDropdown ? handleServiceMouseLeave : undefined}
                  >
                    <Link to={item.path} className="nav-link">
                      {item.label}
                    </Link>
                    {item.hasDropdown && (
                      <ServiceDropdown isOpen={isServiceDropdownOpen} />
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Search Section */}
            <div className="search-section">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </form>
            </div>

            {/* User Authentication Section */}
            <div className="user-section">
              {isAuthenticated ? (
                <div className="user-menu">
                  <span className="username">Xin chào, {user?.username}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i>
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="auth-btn login-btn">
                    <i className="fas fa-sign-in-alt"></i>
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="auth-btn register-btn">
                    <i className="fas fa-user-plus"></i>
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Row */}
          <div className="mobile-nav-row">
            <div className="mobile-current-page">TRANG CHỦ</div>
            <button className="mobile-menu-button" onClick={toggleMobileMenu}>
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
};

export default Header;
