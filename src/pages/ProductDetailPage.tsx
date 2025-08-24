import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import './ProductDetailPage.css';

// Import product brand images
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
import Footer from '../components/sections/Footer';

// Product data
const products = [
  {
    id: 1,
    name: 'Găng tay nấu ăn',
    category: 'Kitchen',
    price: 299000,
    description: 'Găng tay nấu ăn cao cấp, chống nhiệt tốt, an toàn cho sức khỏe',
    images: [gangtayImage, cameraImage, taingheImage, ugreenImage, nintendoImage, chicagoweberImage]
  },
  {
    id: 2,
    name: 'Camera phát trực tuyến',
    category: 'Electronics',
    price: 1299000,
    description: 'Camera phát trực tuyến chất lượng cao, hỗ trợ 4K, tích hợp microphone',
    images: [cameraImage, taingheImage, ugreenImage, nintendoImage, chicagoweberImage, pengwineImage]
  },
  {
    id: 3,
    name: 'Tai nghe chơi game',
    category: 'Audio',
    price: 899000,
    description: 'Tai nghe gaming chuyên nghiệp, âm thanh surround 7.1, microphone tích hợp',
    images: [taingheImage, ugreenImage, nintendoImage, chicagoweberImage, pengwineImage, yataoImage]
  },
  {
    id: 4,
    name: 'UGREEN USB C Hub',
    category: 'Accessories',
    price: 599000,
    description: 'Hub USB-C đa năng, hỗ trợ nhiều cổng kết nối, tương thích tốt',
    images: [ugreenImage, nintendoImage, chicagoweberImage, pengwineImage, yataoImage, datacorImage]
  },
  {
    id: 5,
    name: 'Nintendo Switch OLED',
    category: 'Gaming',
    price: 8999000,
    description: 'Máy chơi game Nintendo Switch OLED màn hình 7 inch, pin trâu',
    images: [nintendoImage, chicagoweberImage, pengwineImage, yataoImage, datacorImage, smallrigImage]
  },
  {
    id: 6,
    name: 'Gia vị Chicago Weber',
    category: 'Kitchen',
    price: 399000,
    description: 'Bộ gia vị nướng BBQ Chicago Weber, hương vị đặc trưng Mỹ',
    images: [chicagoweberImage, pengwineImage, yataoImage, datacorImage, smallrigImage, huionImage]
  },
  {
    id: 7,
    name: 'Rượu vang PengWine',
    category: 'Beverages',
    price: 1599000,
    description: 'Rượu vang đỏ PengWine, hương vị đậm đà, phù hợp tiệc tùng',
    images: [pengwineImage, yataoImage, datacorImage, smallrigImage, huionImage, microsdxcImage]
  },
  {
    id: 8,
    name: 'Máy ảnh Yatao',
    category: 'Electronics',
    price: 2999000,
    description: 'Máy ảnh DSLR Yatao, cảm biến APS-C, ống kính 18-55mm',
    images: [yataoImage, datacorImage, smallrigImage, huionImage, microsdxcImage, gangtayImage]
  },
  {
    id: 9,
    name: 'Datacolor Spyder',
    category: 'Color Analysis',
    price: 3999000,
    description: 'Thiết bị hiệu chỉnh màu sắc chuyên nghiệp cho màn hình',
    images: [datacorImage, smallrigImage, huionImage, microsdxcImage, gangtayImage, cameraImage]
  },
  {
    id: 10,
    name: 'SMALLRIG Card Reader',
    category: 'Accessories',
    price: 799000,
    description: 'Đầu đọc thẻ nhớ tốc độ cao, hỗ trợ nhiều định dạng thẻ',
    images: [smallrigImage, huionImage, microsdxcImage, gangtayImage, cameraImage, taingheImage]
  },
  {
    id: 11,
    name: 'HUION Inspiroy',
    category: 'Drawing Tablet',
    price: 1899000,
    description: 'Bảng vẽ điện tử HUION Inspiroy, bút cảm ứng nhạy, phù hợp thiết kế',
    images: [huionImage, microsdxcImage, gangtayImage, cameraImage, taingheImage, ugreenImage]
  },
  {
    id: 12,
    name: 'Micro SDXC Card',
    category: 'Storage',
    price: 499000,
    description: 'Thẻ nhớ Micro SDXC 128GB, tốc độ đọc/ghi cao, bảo hành chính hãng',
    images: [microsdxcImage, gangtayImage, cameraImage, taingheImage, ugreenImage, nintendoImage]
  }
];

// Product options for selection
const productOptions = [
  { id: 1, name: 'Sản phẩm 1', price: 0 },
  { id: 2, name: 'Sản phẩm 2', price: 0 },
  { id: 3, name: 'Sản phẩm 3', price: 0 },
  { id: 4, name: 'Sản phẩm 4', price: 0 }
];
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hour = String(now.getHours()).padStart(2, '0');
const minute = String(now.getMinutes()).padStart(2, '0');
const second = String(now.getSeconds()).padStart(2, '0');
const orderId = `#${year}${month}${day}${hour}${minute}${second}`;
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown
  const [amountPerOrder, setAmountPerOrder] = useState<number>(0);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  const product = products.find(p => p.id === parseInt(id || '1'));
  
  // Create circular array by duplicating images
  const circularImages = product ? [...product.images, ...product.images, ...product.images] : [];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 60; // Reset to 60 seconds
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Image slider effect
  useEffect(() => {
    if (!product) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        return nextSlide >= product.images.length ? 0 : nextSlide;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [product?.images.length]);

  // Format countdown
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate order ID
  
  
  

  // Handle product selection
  const handleProductSelect = (productId: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
    
    // Initialize quantity if not set
    if (!quantities[productId]) {
      setQuantities(prev => ({ ...prev, [productId]: 1 }));
    }
    
    // Show dropdown when items are selected
    if (selectedProducts.length === 0 || !selectedProducts.includes(productId)) {
      setIsDropdownVisible(true);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, quantity) }));
  };

  // Calculate total
  const calculateTotal = () => {
    return selectedProducts.reduce((total, productId) => {
      const product = productOptions.find(p => p.id === productId);
      const quantity = quantities[productId] || 1;
      return total + (product?.price || 0) * quantity;
    }, 0);
  };

  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };

  if (!product) {
    return (
      <Layout>
        <div className="product-detail-page">
          <div className="container">
            <div className="error-message">
              <h2>Sản phẩm không tồn tại</h2>
              <button onClick={() => navigate('/export')} className="back-button">
                Quay lại trang Export
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="product-detail-page">
        {/* Order Header */}
        <div className="order-header">
          <div className="order-info">
            <div className="order-left">
              <div className="order-label">
                <i className="fas fa-clock"></i>
                <span>Đơn hàng kế tiếp</span>
              </div>
              <div className="countdown">{formatCountdown(countdown)}</div>
            </div>
            <div className="order-right">
              <div className="order-label">Mã đơn hàng</div>
              <div className="order-id">{orderId}</div>
            </div>
          </div>
        </div>

        {/* Company Name */}
        <div className="company-name">
          <h2>Ebay Australia & NZ Pty. Ltd</h2>
        </div>

        {/* Product Selection */}
        <div className="product-selection">
          <div className="product-options">
            {productOptions.map((option) => (
              <div
                key={option.id}
                className={`product-option ${selectedProducts.includes(option.id) ? 'selected' : ''}`}
                onClick={() => handleProductSelect(option.id)}
              >
                <span>{option.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Dropdown */}
        {selectedProducts.length > 0 && isDropdownVisible && (
          <div className="cart-dropdown">
            <div className="dropdown-row">
              <span className="dropdown-label">Nội dung:</span>
              <span className="dropdown-value">
                {selectedProducts.map((productId) => {
                  const product = productOptions.find(p => p.id === productId);
                  return product?.name;
                }).join(', ')}
              </span>
                             <i 
                 className="fas fa-chevron-down" 
                 onClick={() => setIsDropdownVisible(false)}
                 style={{ cursor: 'pointer' }}
               ></i>
            </div>
            <div className="dropdown-row">
              <span className="dropdown-label">Số tiền mỗi đơn:</span>
              <input 
                type="number" 
                className="amount-input"
                placeholder="Vui lòng nhập Số tiền"
                value={amountPerOrder}
                onChange={(e) => setAmountPerOrder(Number(e.target.value) || 0)}
              />
            </div>
            <div className="dropdown-row">
              <span className="dropdown-label">Chọn {selectedProducts.length}</span>
              <span className="dropdown-label">Tổng tiền {formatPrice(amountPerOrder * selectedProducts.length)}</span>
            </div>
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="bottom-action-bar">
          <div className="action-bar-left">
            <i className="fas fa-shopping-cart"></i>
            <div className="separator"></div>
            <div className="cart-display">
              {selectedProducts.length === 0 ? (
                <span className="empty-cart-text">Giỏ hàng trống</span>
              ) : (
                <span className="cart-items-count">
                  Chọn <span style={{ color: '#dc3545', fontWeight: 'bold' }}>{selectedProducts.length}</span>
                </span>
              )}
            </div>
          </div>
          
          <div className="action-bar-right">
            <div className="balance-display">
              <span className="balance-label">Tổng tiền</span>
              <span className="balance-amount">{formatPrice(calculateTotal())}</span>
            </div>
            <div className="balance-display" style={{ marginLeft: '15px' }}>
              <span className="balance-label">Số dư</span>
              <span className="balance-amount">0</span>
            </div>
            <button className="export-order-btn">Xuất đơn</button>
          </div>
        </div>



        {/* Back Button */}
        <button className="back-button" onClick={() => navigate('/export')}>
          ← Quay lại
        </button>


      </div>
      <Footer />
    </Layout>
  );
};

export default ProductDetailPage;
