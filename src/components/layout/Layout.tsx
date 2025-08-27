import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { openTelegram } from '../../config/contact';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // TODO: Implement search functionality
  };

  const handleContactClick = () => {
    openTelegram();
  };

  return (
    <div className="App">
      <Header onSearch={handleSearch} />
      <main className="main-content">
        {children}
      </main>
      <BottomNavigation />
      
      {/* Fixed Contact Icon */}
      <div className="fixed-contact-icon" onClick={handleContactClick}>
        <div className="contact-icon-circle">
          <i className="fa-solid fa-headset"></i>
        </div>
      </div>
    </div>
  );
};

export default Layout;
