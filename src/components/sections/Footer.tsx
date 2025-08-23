import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Left Section - About Us */}
          <div className="footer-section">
            <h3 className="section-title">VÀI DÒNG GIỚI THIỆU</h3>
            <div className="title-separator"></div>
            <div className="section-content">
              <p>
                DHLSHIPPING cung cấp dịch vụ đặt hàng từ Úc, Mỹ, Hàn Quốc, Thái Lan và dịch vụ vận chuyển hàng đến các nước như Mỹ, Đức, Pháp, Hungary, Việt Nam. Chúng tôi giúp khách hàng trên toàn thế giới tiếp cận nguồn hàng hóa chất lượng cao để mua sắm và vận chuyển, mong muốn được đồng hành cùng bạn chinh phục thị trường.
              </p>
            </div>
          </div>

          {/* Middle Section - Contact Information */}
          <div className="footer-section">
            <h3 className="section-title">THÔNG TIN LIÊN HỆ</h3>
            <div className="title-separator"></div>
            <div className="section-content">
              <div className="contact-info">
                <div className="contact-item">
                  <strong>DHL Australia:</strong>
                  <p>1/283 Coward St, Mascot NSW 2020, Australia</p>
                </div>
                <div className="contact-item">
                  <strong>DHL South Korea:</strong>
                  <p>충청북도 청주시 구 오창읍 각리 가곡로 459 청원</p>
                </div>
                <div className="contact-item">
                  <strong>DHL Vietnam:</strong>
                  <p>348 Nguyễn Văn Công, Phường 3, Gò Vấp, Hồ Chí Minh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Fanpage */}
          <div className="footer-section">
            <h3 className="section-title">FANPAGE</h3>
            <div className="title-separator"></div>
            <div className="section-content">
              <div className="facebook-widget">
                <div className="fb-page-info">
                  <div className="fb-profile">
                    <div className="fb-avatar"></div>
                    <div className="fb-details">
                      <h4>DHL Shipping</h4>
                      <p>3,784 followers</p>
                    </div>
                  </div>
                  <div className="fb-actions">
                    <button className="fb-follow-btn">
                      <i className="fab fa-facebook-f"></i>
                      Follow Page
                    </button>
                    <button className="fb-share-btn">
                      <i className="fas fa-share"></i>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
