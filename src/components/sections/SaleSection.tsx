import React from 'react';
import './SaleSection.css';

const SaleSection: React.FC = () => {
  return (
    <section className="sale-section">
      <div className="sale-container">
        <div className="sale-content">
          <div className="sale-text">
            <h1>SALE</h1>
          </div>
          
          <div className="shopping-cart">
            <div className="cart-body">
              <div className="cart-bag red-bag"></div>
              <div className="cart-bag green-bag"></div>
            </div>
            <div className="cart-wheels">
              <div className="wheel"></div>
              <div className="wheel"></div>
            </div>
          </div>
          
          <div className="jumping-person">
            <div className="person-body">
              <div className="person-head"></div>
              <div className="person-torso"></div>
              <div className="person-arms">
                <div className="arm left-arm"></div>
                <div className="arm right-arm"></div>
              </div>
              <div className="person-legs">
                <div className="leg left-leg"></div>
                <div className="leg right-leg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaleSection;
