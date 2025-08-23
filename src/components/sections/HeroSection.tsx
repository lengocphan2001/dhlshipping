import React, { useState } from 'react';
import './HeroSection.css';
import heroImage from '../../assets/images/bg-home-contact.jpg';

const HeroSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    note: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Handle form submission
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
      <img src={heroImage} alt="DHL Logo" className="logo-image" />
      </div>
      
      <div className="hero-container">
        <div className="hero-content">
          {/* Left Column - Main Content */}
          <div className="hero-left">
            <div className="content-box">
              <h1>Chất lượng và uy tín hàng đầu</h1>
              <h2>Nhân giá trị cộng niềm tin</h2>
              
              <div className="company-info">
                <p>
                  DHL Express là thành viên của VietPost Pty Ltd, có trụ sở tại: 
                  Lot. 06, 14-16 Belmore Road, Punchbowl NSW 2196
                </p>
              </div>
              
              <div className="service-description">
                <p>
                  Chúng tôi cung cấp dịch vụ vận chuyển hàng từ Úc về qua các nước toàn quốc. 
                  Mang đến cho bạn lựa chọn mua sắm thoải mái và vận chuyển các mặt hàng từ các 
                  cửa hàng của Úc sang các nước với mức giá tối ưu nhất!
                </p>
                
                <p>
                  Chúng tôi khát khao mong muốn được đồng hành cùng doanh nghiệp của bạn chinh 
                  phục thị trường thế giới. Dịch vụ của chúng tôi giúp khách hàng tại toàn quốc 
                  tế nhanh chóng tiếp cận nguồn hàng hóa chất lượng cao từ Úc và mua hàng, 
                  vận chuyển xuất nhập đơn hàng toàn quốc.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact Form */}
          <div className="hero-right">
            <div className="contact-box">
              <h3>Liên hệ với chúng tôi</h3>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Họ và tên"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <textarea
                    name="note"
                    placeholder="Note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <button type="submit" className="submit-btn">
                  Đăng ký ngay
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
