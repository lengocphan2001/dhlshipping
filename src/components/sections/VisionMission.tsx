import React from 'react';
import infoPtImage from '../../assets/images/info-pt.png';
import './VisionMission.css';

const VisionMission: React.FC = () => {
  return (
    <section className="vision-mission">
      <div className="container">
        {/* Header Section */}
        <div className="section-header">
          <h2 className="main-title">DHL EXPRESS</h2>
          <div className="title-underline"></div>
          <p className="tagline">"Sự lựa chọn hoàn hảo nhất cho Doanh nghiệp và mọi nhà"</p>
        </div>

        {/* Content Section */}
        <div className="content-wrapper">
          {/* Left Column - Vision & Mission */}
          <div className="vision-mission-box">
            <div className="vision-section">
              <h3>Tầm nhìn</h3>
              <p>Đáng tin cậy cho các doanh nghiệp thuộc mọi quy mô. Xây dựng mối quan hệ lâu dài với khách hàng dựa trên sự tin tưởng và tôn trọng lẫn nhau. </p>
              <p>Tập trung vào việc cung cấp các giải pháp chuỗi cung ứng hiệu quả và đáng tin cậy đồng thời ưu tiên sự hài lòng của khách hàng.</p>
            </div>

            <div className="mission-section">
              <h3>Sứ mệnh</h3>
              <p>Cung cấp cho khách hàng các giải pháp sáng tạo, hiệu quả về chi phí, đáp ứng nhu cầu vận chuyển của khách hàng.</p>
              <p>An toàn, bền vững và trách nhiệm xã hội. Chất lượng dịch vụ, sự hài lòng của khách hàng, tăng trưởng và lợi nhuận.</p>
            </div>
          </div>

          {/* Right Column - Logistics Image */}
          <div className="logistics-image">
            <img src={infoPtImage} alt="DHL Logistics Information" className="info-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
