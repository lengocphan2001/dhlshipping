import React from 'react';
import './NewsSection.css';

// Import images for the news articles
import new1Image from '../../assets/images/news-1.jpg';
import new2Image from '../../assets/images/news-2.jpg';
import new3Image from '../../assets/images/news-3.jpg';

interface NewsArticle {
  id: number;
  image: string;
  title: string;
  description: string;
}

const newsArticles: NewsArticle[] = [
  {
    id: 1,
    image: new1Image,
    title: 'BÍ QUYẾT SĂN SALE TRÊN CÁC SÀN THƯƠNG MẠI ĐIỆN TỬ',
    description: 'Thời gian gần đây, xu hướng mua sắm trực tuyến đã trở nên cực kỳ phổ biến. Các sàn thương mại điện tử liên tục tung ra các chương trình khuyến mãi, giảm giá hấp dẫn, thu hút đông đảo người tiêu dùng. Để không bỏ lỡ những ưu đãi tốt nhất, bạn cần có những bí quyết săn sale hiệu quả.'
  },
  {
    id: 2,
    image: new2Image,
    title: 'GIẢI PHÁP VẬN CHUYỂN NƯỚC HOA TỪ ÚC VỀ VIỆT NAM AN TOÀN, HIỆU QUẢ',
    description: 'Nước hoa, với thành phần đặc biệt và quy định vận chuyển khắt khe, luôn là một bài toán khó đối với nhiều người muốn gửi từ Úc về Việt Nam. Chúng tôi cung cấp giải pháp vận chuyển chuyên nghiệp, đảm bảo an toàn và hiệu quả cho mọi loại nước hoa.'
  },
  {
    id: 3,
    image: new3Image,
    title: 'DỊCH VỤ GỬI HÀNG QUỐC TẾ TỪ ÚC VỀ VIỆT NAM CHUYÊN NGHIỆP CỦA CÔNG TY DHL',
    description: 'Trong bối cảnh giao thương quốc tế ngày càng phát triển, nhu cầu gửi hàng từ Úc về Việt Nam tăng cao. Công ty DHL tự hào mang đến dịch vụ gửi hàng quốc tế chuyên nghiệp, nhanh chóng và đáng tin cậy, đáp ứng mọi nhu cầu của khách hàng.'
  }
];

const NewsSection: React.FC = () => {
  return (
    <section className="news-section">
      <div className="container">
        <div className="section-header">
          <h2 className="main-title">Tin tức</h2>
          <div className="title-underline"></div>
        </div>
        <div className="news-grid">
          {newsArticles.map(article => (
            <div className="news-card" key={article.id}>
              <div className="card-image">
                <img src={article.image} alt={article.title} />
              </div>
              <div className="card-content">
                <h3 className="card-title">{article.title}</h3>
                <p className="card-description">{article.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
