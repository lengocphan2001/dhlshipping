import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ImageSlider from '../components/ui/ImageSlider';
import './ImportPage.css';
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

// Sample product data based on the image
const products = [
  {
    id: 1,
    name: 'Găng tay nấu ăn Showaglove (Mã sản phẩm: NICE HAND)',
    price: '115.000 VNĐ',
    image: gangtayImage
  },
  {
    id: 2,
    name: 'Camera phát trực tuyến OBSBOT Tail Air NDI 4K',
    price: '13.400.000 VNĐ',
    image: cameraImage
  },
  {
    id: 3,
    name: 'Tai nghe chơi game không dây Corsair Void',
    price: '3.600.000 VNĐ',
    image: taingheImage
  },
  {
    id: 4,
    name: 'UGREEN Revodok 105 USB C Hub 5 trong 1',
    price: '320.000 VNĐ',
    image: ugreenImage
  },
  {
    id: 5,
    name: 'Máy chơi game Nintendo Switch OLED',
    price: '7.500.000 VNĐ',
    image: nintendoImage
  },
  {
    id: 6,
    name: 'Gia vị bít tết Chicago Weber',
    price: '97.000 VNĐ',
    image: chicagoweberImage
  },
  {
    id: 7,
    name: 'Rượu vang đỏ PengWine King Carmenere/Malbec',
    price: '1.880.000 VNĐ',
    image: pengwineImage
  },
  {
    id: 8,
    name: 'Máy ảnh kỹ thuật số Yatao dùng để chụp ảnh',
    price: '4.432.000 VND',
    image: yataoImage
  },
  {
    id: 9,
    name: 'Datacolor Spyder Print - Công cụ phân tích màu sắc',
    price: '8.969.800 VND',
    image: datacorImage
  },
  {
    id: 10,
    name: 'SMALLRIG 9 trong 1 CFexpress Type A Card Reader',
    price: '2.346.489 VND',
    image: smallrigImage
  },
  {
    id: 11,
    name: 'Máy tính bảng vẽ HUION Inspiroy H640',
    price: '834.130 VND',
    image: huionImage
  },
  {
    id: 12,
    name: 'Thẻ nhớ Micro SDXC Amazon Basics có bộ nhớ 128GB',
    price: '288.390 VND',
    image: microsdxcImage
  }
];

// Sample slider images
const sliderImages = [
  {
    id: 1,
    image: '/images/hero-bg.jpg'
  },
  {
    id: 2,
    image: '/images/shipping-container.jpg'
  },
  {
    id: 3,
    image: '/images/airplane-wing.jpg'
  }
];

const ImportPage: React.FC = () => {
  const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    console.log('Product clicked:', productId);
    navigate(`/product/${productId}`);
  };

  return (
    <Layout>
      <div className="import-page">
        {/* Image Slider Section */}
        <div className="slider-section">
          <ImageSlider slides={sliderImages} autoPlay={true} interval={5000} showProductSection={false} />
        </div>

        {/* Products Grid Section */}
        <div className="products-section">
          <div className="container">
            <div className="products-grid">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => {
                    console.log('Card clicked for product:', product.id, product.name);
                    handleProductClick(product.id);
                  }}
                >
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-price">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
        
      </div>
    </Layout>
  );
};

export default ImportPage;
