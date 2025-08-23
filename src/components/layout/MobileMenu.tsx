import React, { useState } from 'react';
import './MobileMenu.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [expandedServices, setExpandedServices] = useState(false);

  const navItems = [
    { label: 'TRANG CHỦ', path: '/' },
    { label: 'GIỚI THIỆU', path: '/about' },
    { 
      label: 'DỊCH VỤ', 
      path: '/services', 
      hasSubmenu: true,
      subItems: [
        { label: 'Dịch vụ vận chuyển hàng từ úc về Việt Nam', path: '/services/shipping' },
        { label: 'Dịch vụ Drop Ship hàng từ Úc về Việt Nam', path: '/services/dropship' },
        { label: 'Dịch vụ Order hàng úc chính hãng giá tốt', path: '/services/order' }
      ]
    },
    { label: 'TIN TỨC', path: '/news' },
    { label: 'HÀNG ORDER', path: '/order' },
    { label: 'TRACKING', path: '/tracking' }
  ];

  const toggleServices = () => {
    setExpandedServices(!expandedServices);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="mobile-menu-overlay" onClick={onClose} />}
      
      {/* Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <nav className="mobile-nav">
          {navItems.map((item, index) => (
            <div key={index}>
              {item.hasSubmenu ? (
                <div className="mobile-nav-item-with-submenu">
                  <button 
                    className="mobile-nav-link mobile-nav-toggle"
                    onClick={toggleServices}
                  >
                    {item.label}
                    <svg 
                      className={`toggle-icon ${expandedServices ? 'expanded' : ''}`}
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  <div className={`mobile-submenu ${expandedServices ? 'expanded' : ''}`}>
                    {item.subItems?.map((subItem, subIndex) => (
                      <a 
                        key={subIndex}
                        href={subItem.path} 
                        className="mobile-submenu-link"
                        onClick={onClose}
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a 
                  href={item.path} 
                  className="mobile-nav-link"
                  onClick={onClose}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
