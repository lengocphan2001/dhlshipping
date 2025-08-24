import React from 'react';
import Layout from '../components/layout/Layout';
import BasicImageSlider from '../components/ui/BasicImageSlider';
import './ExportPage.css';
import Footer from '../components/sections/Footer';

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

// Product brand slider images
const sliderImages = [
  {
    id: 1,
    name: 'Găng tay nấu ăn',
    image: gangtayImage
  },
  {
    id: 2,
    name: 'Camera phát trực tuyến',
    image: cameraImage
  },
  {
    id: 3,
    name: 'Tai nghe chơi game',
    image: taingheImage
  },
  {
    id: 4,
    name: 'UGREEN USB C Hub',
    image: ugreenImage
  },
  {
    id: 5,
    name: 'Nintendo Switch OLED',
    image: nintendoImage
  },
  {
    id: 6,
    name: 'Gia vị Chicago Weber',
    image: chicagoweberImage
  },
  {
    id: 7,
    name: 'Rượu vang PengWine',
    image: pengwineImage
  },
  {
    id: 8,
    name: 'Máy ảnh Yatao',
    image: yataoImage
  },
  {
    id: 9,
    name: 'Datacolor Spyder',
    image: datacorImage
  },
  {
    id: 10,
    name: 'SMALLRIG Card Reader',
    image: smallrigImage
  },
  {
    id: 11,
    name: 'HUION Inspiroy',
    image: huionImage
  },
  {
    id: 12,
    name: 'Micro SDXC Card',
    image: microsdxcImage
  }
];

// Popular destinations data
const popularDestinations = [
  {
    id: 1,
    name: 'Găng tay nấu ăn',
    image: gangtayImage,
    category: 'Kitchen'
  },
  {
    id: 2,
    name: 'Camera phát trực tuyến',
    image: cameraImage,
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Tai nghe chơi game',
    image: taingheImage,
    category: 'Audio'
  },
  {
    id: 4,
    name: 'UGREEN USB C Hub',
    image: ugreenImage,
    category: 'Accessories'
  },
  {
    id: 5,
    name: 'Nintendo Switch OLED',
    image: nintendoImage,
    category: 'Gaming'
  },
  {
    id: 6,
    name: 'Gia vị Chicago Weber',
    image: chicagoweberImage,
    category: 'Kitchen'
  },
  {
    id: 7,
    name: 'Rượu vang PengWine',
    image: pengwineImage,
    category: 'Beverages'
  },
  {
    id: 8,
    name: 'Máy ảnh Yatao',
    image: yataoImage,
    category: 'Electronics'
  }
];

// Top watch brands data
const topWatchBrands = [
  {
    id: 1,
    name: 'Datacolor Spyder',
    image: datacorImage,
    category: 'Color Analysis'
  },
  {
    id: 2,
    name: 'SMALLRIG Card Reader',
    image: smallrigImage,
    category: 'Accessories'
  },
  {
    id: 3,
    name: 'HUION Inspiroy',
    image: huionImage,
    category: 'Drawing Tablet'
  },
  {
    id: 4,
    name: 'Micro SDXC Card',
    image: microsdxcImage,
    category: 'Storage'
  },
  {
    id: 5,
    name: 'Găng tay nấu ăn',
    image: gangtayImage,
    category: 'Kitchen'
  },
  {
    id: 6,
    name: 'Camera phát trực tuyến',
    image: cameraImage,
    category: 'Electronics'
  },
  {
    id: 7,
    name: 'Tai nghe chơi game',
    image: taingheImage,
    category: 'Audio'
  },
  {
    id: 8,
    name: 'UGREEN USB C Hub',
    image: ugreenImage,
    category: 'Accessories'
  }
];

const ExportPage: React.FC = () => {
  return (
    <Layout>
      <div className="export-page">

        {/* Brand Products Section */}
        <div className="brand-products-section">
          <div className="container">
            {/* Popular Destinations */}
            <div className="brand-grid-section">
              <div className="brand-grid">
                {popularDestinations.map((item) => (
                  <div key={item.id} className="brand-item">
                    <div className="brand-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="brand-info">
                      <h3 className="brand-name">{item.name}</h3>
                      <p className="brand-category">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Watch Brands */}
            <div className="brand-grid-section">
              <div className="section-header">
                <h2>Top Watch Brands</h2>
                <p>Premium timepieces from renowned manufacturers</p>
              </div>
              
              <div className="brand-grid">
                {topWatchBrands.map((item) => (
                  <div key={item.id} className="brand-item">
                    <div className="brand-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="brand-info">
                      <h3 className="brand-name">{item.name}</h3>
                      <p className="brand-category">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </Layout>
  );
};

export default ExportPage;
