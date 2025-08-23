import React from 'react';
import servicePanelImage from '../../assets/images/service-panel1.jpg';
import servicePanel2Image from '../../assets/images/service-panel2.jpg';
import servicePanel3Image from '../../assets/images/service-panel3.jpg';
import './ServicePanels.css';

interface ServicePanel {
  id: number;
  title: string;
  image: string;
  description: string;
}

const ServicePanels: React.FC = () => {
  const services: ServicePanel[] = [
    {
      id: 1,
      title: 'Dịch vụ vận chuyển hàng từ úc về Việt Nam',
      image: servicePanelImage,
      description: 'Chuyên nghiệp, nhanh chóng và an toàn. Chúng tôi cung cấp dịch vụ vận chuyển hàng hóa từ Úc về Việt Nam với thời gian giao hàng đảm bảo và chi phí cạnh tranh.'
    },
    {
      id: 2,
      title: 'Dịch vụ Drop Ship hàng từ Úc về Việt Nam',
      image: servicePanel2Image,
      description: 'Giải pháp drop shipping tối ưu cho doanh nghiệp. Chúng tôi xử lý toàn bộ quy trình từ đặt hàng, đóng gói đến giao hàng tận nơi.'
    },
    {
      id: 3,
      title: 'Dịch vụ Order hàng úc chính hãng giá tốt',
      image: servicePanel3Image,
      description: 'Đặt hàng trực tiếp từ các thương hiệu Úc chính hãng với giá tốt nhất. Đảm bảo chất lượng và nguồn gốc xuất xứ rõ ràng.'
    }
  ];

  return (
    <section className="service-panels">
      <div className="container">
        <div className="panels-grid">
          {services.map((service) => (
            <div key={service.id} className="service-panel">
              <div className="panel-image">
                <img src={service.image} alt={service.title} />
                <div className="panel-overlay">
                  <div className="overlay-content">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <button className="learn-more-btn">Tìm hiểu thêm</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicePanels;
