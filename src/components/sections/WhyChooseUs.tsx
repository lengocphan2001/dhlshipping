import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      id: 1,
      icon: '⚙️',
      title: 'Dịch vụ vận chuyển hàng từ Úc sang các nước quốc tế',
      description: 'Đảm bảo chất lượng hàng hóa chính hãng, mang lại giải pháp hiệu quả, đồng thời thỏa mãn được những mong muốn của khách hàng khi sử dụng dịch vụ của chúng tôi.'
    },
    {
      id: 2,
      icon: '💰',
      title: 'DHL, có đủ năng lực đáp ứng mọi yêu cầu',
      description: 'Đảm bảo sự hoạt động liên tục và tính kịp thời về tiến độ vận chuyển hàng hóa cho các khách hàng: cá nhân, các tổ chức, doanh nghiệp.'
    },
    {
      id: 3,
      icon: '👥',
      title: 'Nhân viên tận tình, chu đáo',
      description: 'Luôn đặt chữ tín và sự hài lòng của quý khách lên hàng đầu.'
    },
    {
      id: 4,
      icon: '🕒',
      title: 'Giá thành hợp lý',
      description: 'Hỗ trợ khách hàng 24/7.'
    }
  ];

  return (
    <section className="why-choose-us">
      <div className="container">
        <div className="section-header">
          <h2>TẠI SAO LẠI CHỌN CHÚNG TÔI?</h2>
          <div className="underline"></div>
        </div>
        
        <div className="reasons-grid">
          {reasons.map((reason) => (
            <div key={reason.id} className="reason-card">
              <div className="reason-icon">
                <span>{reason.icon}</span>
              </div>
              <div className="reason-content">
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
