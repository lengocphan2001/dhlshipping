import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import './ProductReviewPage.css';
import Footer from '../components/sections/Footer';

// Import product images
import gangtayImage from '../assets/images/products/gangtay.jpg';
import cameraImage from '../assets/images/products/camera.jpg';
import taingheImage from '../assets/images/products/tainghe.jpg';
import ugreenImage from '../assets/images/products/ugreen.jpg';
import nintendoImage from '../assets/images/products/nintendo.jpg';
import chicagoweberImage from '../assets/images/products/chicagoweber.jpg';
import pengwineImage from '../assets/images/products/pengwine.jpg';
import yataoImage from '../assets/images/products/yatao.jpg';
import datacorImage from '../assets/images/products/datacor.jpg';
import smallrigImage from '../assets/images/products/smallrig.jpg';
import huionImage from '../assets/images/products/huion.jpg';
import microsdxcImage from '../assets/images/products/microsdxc.jpg';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  specifications: string[];
  rating: number;
  reviewCount: number;
  productCode: string;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

const ProductReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Product database
  const productsData: Product[] = [
    {
      id: 1,
      name: 'Găng tay nấu ăn Showaglove (Mã sản phẩm: NICE HAND)',
      price: '115.000 VNĐ',
      image: gangtayImage,
      description: 'Găng tay nấu ăn cao cấp, chống nhiệt tốt, an toàn cho việc nấu nướng.',
      specifications: ['Chất liệu: Silicon cao cấp', 'Chống nhiệt: -40°C đến 250°C', 'Kích thước: One size fits all', 'Màu sắc: Đen'],
      rating: 4.5,
      reviewCount: 89,
      productCode: 'NICE HAND'
    },
    {
      id: 2,
      name: 'Camera phát trực tuyến OBSBOT Tail Air NDI 4K',
      price: '13.400.000 VNĐ',
      image: cameraImage,
      description: 'Camera phát trực tuyến chuyên nghiệp với độ phân giải 4K, tích hợp AI tracking.',
      specifications: ['Độ phân giải: 4K UHD', 'Lens: 23mm F/1.8', 'Kết nối: NDI, USB-C', 'AI Tracking: Có'],
      rating: 4.8,
      reviewCount: 131,
      productCode: 'DHL1860216'
    },
    {
      id: 3,
      name: 'Tai nghe chơi game không dây Corsair Void',
      price: '3.600.000 VNĐ',
      image: taingheImage,
      description: 'Tai nghe gaming không dây với âm thanh surround 7.1, mic khử tiếng ồn.',
      specifications: ['Âm thanh: 7.1 Surround', 'Kết nối: 2.4GHz Wireless', 'Pin: 16 giờ', 'Mic: Khử tiếng ồn'],
      rating: 4.3,
      reviewCount: 67,
      productCode: 'CORSAIR001'
    },
    {
      id: 4,
      name: 'UGREEN Revodok 105 USB C Hub 5 trong 1',
      price: '320.000 VNĐ',
      image: ugreenImage,
      description: 'Hub USB-C đa năng với 5 cổng kết nối, tương thích với nhiều thiết bị.',
      specifications: ['Cổng: 5 trong 1', 'Tốc độ: USB 3.0', 'Tương thích: MacBook, Windows', 'Thiết kế: Nhỏ gọn'],
      rating: 4.6,
      reviewCount: 234,
      productCode: 'UGREEN105'
    },
    {
      id: 5,
      name: 'Máy chơi game Nintendo Switch OLED',
      price: '7.500.000 VNĐ',
      image: nintendoImage,
      description: 'Máy chơi game cầm tay với màn hình OLED 7 inch, pin trâu.',
      specifications: ['Màn hình: 7 inch OLED', 'Pin: 4.5-9 giờ', 'Lưu trữ: 64GB', 'Kết nối: WiFi, Bluetooth'],
      rating: 4.7,
      reviewCount: 156,
      productCode: 'NINTENDO001'
    },
    {
      id: 6,
      name: 'Gia vị bít tết Chicago Weber',
      price: '97.000 VNĐ',
      image: chicagoweberImage,
      description: 'Gia vị nướng BBQ chuyên nghiệp, hương vị đậm đà kiểu Chicago.',
      specifications: ['Trọng lượng: 340g', 'Hương vị: BBQ Chicago', 'Thành phần: Tự nhiên', 'Đóng gói: Hộp thiếc'],
      rating: 4.4,
      reviewCount: 78,
      productCode: 'WEBER001'
    },
    {
      id: 7,
      name: 'Rượu vang đỏ PengWine King Carmenere/Malbec',
      price: '1.880.000 VNĐ',
      image: pengwineImage,
      description: 'Rượu vang đỏ cao cấp từ Chile, hương vị phức hợp và đậm đà.',
      specifications: ['Xuất xứ: Chile', 'Nồng độ: 13.5%', 'Thể tích: 750ml', 'Loại: Carmenere/Malbec'],
      rating: 4.2,
      reviewCount: 45,
      productCode: 'PENGWINE001'
    },
    {
      id: 8,
      name: 'Máy ảnh kỹ thuật số Yatao dùng để chụp ảnh',
      price: '4.432.000 VND',
      image: yataoImage,
      description: 'Máy ảnh kỹ thuật số với cảm biến CMOS, zoom quang học 10x.',
      specifications: ['Cảm biến: CMOS 20MP', 'Zoom: 10x quang học', 'Màn hình: 3 inch LCD', 'Pin: Li-ion'],
      rating: 4.1,
      reviewCount: 32,
      productCode: 'YATAO001'
    },
    {
      id: 9,
      name: 'Datacolor Spyder Print - Công cụ phân tích màu sắc',
      price: '8.969.800 VND',
      image: datacorImage,
      description: 'Thiết bị hiệu chỉnh màu sắc chuyên nghiệp cho in ấn và thiết kế.',
      specifications: ['Độ chính xác: ±0.5 ΔE', 'Tương thích: Windows/Mac', 'Kết nối: USB', 'Ứng dụng: In ấn'],
      rating: 4.9,
      reviewCount: 28,
      productCode: 'DATACOLOR001'
    },
    {
      id: 10,
      name: 'SMALLRIG 9 trong 1 CFexpress Type A Card Reader',
      price: '2.346.489 VND',
      image: smallrigImage,
      description: 'Card reader đa năng hỗ trợ nhiều loại thẻ nhớ, tốc độ truyền cao.',
      specifications: ['Hỗ trợ: CFexpress Type A/B', 'Tốc độ: USB 3.2 Gen 2', 'Kết nối: USB-C', 'Thiết kế: Nhôm'],
      rating: 4.5,
      reviewCount: 89,
      productCode: 'SMALLRIG001'
    },
    {
      id: 11,
      name: 'Máy tính bảng vẽ HUION Inspiroy H640',
      price: '834.130 VND',
      image: huionImage,
      description: 'Bảng vẽ kỹ thuật số với độ nhạy cao, phù hợp cho thiết kế đồ họa.',
      specifications: ['Kích thước: 6.3 x 3.9 inch', 'Độ nhạy: 8192 levels', 'Tốc độ: 233 PPS', 'Tương thích: Windows/Mac'],
      rating: 4.3,
      reviewCount: 67,
      productCode: 'HUION001'
    },
    {
      id: 12,
      name: 'Thẻ nhớ Micro SDXC Amazon Basics có bộ nhớ 128GB',
      price: '288.390 VND',
      image: microsdxcImage,
      description: 'Thẻ nhớ Micro SDXC dung lượng lớn, tốc độ đọc/ghi cao.',
      specifications: ['Dung lượng: 128GB', 'Tốc độ: Class 10', 'Tương thích: SDXC', 'Bảo hành: 3 năm'],
      rating: 4.6,
      reviewCount: 189,
      productCode: 'AMAZON001'
    }
  ];

  // Sample reviews data
  const sampleReviews: Review[] = [
    {
      id: 1,
      userName: 'Nguyễn Văn A',
      rating: 5,
      date: '2024-01-15',
      comment: 'Sản phẩm chất lượng rất tốt, đóng gói cẩn thận. Giao hàng nhanh chóng!',
      helpful: 12
    },
    {
      id: 2,
      userName: 'Trần Thị B',
      rating: 4,
      date: '2024-01-10',
      comment: 'Sản phẩm đúng như mô tả, giá cả hợp lý. Khuyến nghị mua!',
      helpful: 8
    },
    {
      id: 3,
      userName: 'Lê Văn C',
      rating: 5,
      date: '2024-01-08',
      comment: 'Chất lượng vượt mong đợi, dịch vụ khách hàng tốt.',
      helpful: 15
    },
    {
      id: 4,
      userName: 'Phạm Thị D',
      rating: 3,
      date: '2024-01-05',
      comment: 'Sản phẩm tốt nhưng giao hàng hơi chậm một chút.',
      helpful: 5
    },
    {
      id: 5,
      userName: 'Hoàng Văn E',
      rating: 5,
      date: '2024-01-03',
      comment: 'Rất hài lòng với sản phẩm này. Sẽ mua thêm!',
      helpful: 20
    }
  ];

  useEffect(() => {
    console.log('ProductReviewPage: id from params:', id);
    const productId = parseInt(id || '0');
    console.log('ProductReviewPage: parsed productId:', productId);
    const foundProduct = productsData.find(p => p.id === productId);
    console.log('ProductReviewPage: found product:', foundProduct);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setReviews(sampleReviews);
    } else {
      console.log('ProductReviewPage: Product not found, redirecting to /import');
      navigate('/import');
    }
    
    setLoading(false);
  }, [id, navigate]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= rating ? 'filled' : ''}`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="error-container">
          <h2>Sản phẩm không tồn tại</h2>
          <button onClick={() => navigate('/import')}>Quay lại trang sản phẩm</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="product-review-page">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span onClick={() => navigate('/import')}>Sản phẩm</span>
            <span className="separator">›</span>
            <span>{product.name}</span>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <div className="product-images">
              <div className="main-image">
                <img src={product.image} alt={product.name} />
              </div>
            </div>

            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-code">Mã sản phẩm: {product.productCode}</div>
              
              <div className="product-rating">
                <div className="stars">
                  {renderStars(product.rating)}
                </div>
                <span className="rating-text">{product.rating}/5</span>
                <span className="review-count">({product.reviewCount} lượt đánh giá)</span>
              </div>

              <div className="product-price">{product.price}</div>
              
              <div className="product-description">
                <h3>Mô tả sản phẩm</h3>
                <p>{product.description}</p>
              </div>

              <div className="product-specifications">
                <h3>Thông số kỹ thuật</h3>
                <ul>
                  {product.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h2>Đánh giá sản phẩm ({reviews.length})</h2>
              <div className="overall-rating">
                <div className="rating-summary">
                  <div className="average-rating">
                    <span className="rating-number">{product.rating}</span>
                    <div className="stars">{renderStars(product.rating)}</div>
                  </div>
                  <div className="rating-text">trên 5 sao</div>
                </div>
              </div>
            </div>

            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">{review.userName}</span>
                      <div className="review-stars">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="review-date">{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="review-comment">{review.comment}</div>
                  <div className="review-helpful">
                    <button className="helpful-btn">
                      <i className="fas fa-thumbs-up"></i>
                      Hữu ích ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
};

export default ProductReviewPage;
