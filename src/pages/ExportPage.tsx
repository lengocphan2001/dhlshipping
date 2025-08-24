import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BasicImageSlider from '../components/ui/BasicImageSlider';
import './ExportPage.css';
import Footer from '../components/sections/Footer';

// Import brand product images
import product1Image from '../assets/images/brand_products/product1.jpg';
import product2Image from '../assets/images/brand_products/product2.jpg';
import product3Image from '../assets/images/brand_products/product3.jpg';
import product4Image from '../assets/images/brand_products/product4.jpg';
import product5Image from '../assets/images/brand_products/product5.jpg';
import product6Image from '../assets/images/brand_products/product6.jpg';
import product7Image from '../assets/images/brand_products/product7.jpg';
import product8Image from '../assets/images/brand_products/product8.jpg';
import product9Image from '../assets/images/brand_products/product9.jpg';
import product10Image from '../assets/images/brand_products/product10.jpg';

// Product brand slider images
const sliderImages = [
  {
    id: 1,
    name: 'Product 1',
    image: product1Image
  },
  {
    id: 2,
    name: 'Product 2',
    image: product2Image
  },
  {
    id: 3,
    name: 'Product 3',
    image: product3Image
  },
  {
    id: 4,
    name: 'Product 4',
    image: product4Image
  },
  {
    id: 5,
    name: 'Product 5',
    image: product5Image
  },
  {
    id: 6,
    name: 'Product 6',
    image: product6Image
  },
  {
    id: 7,
    name: 'Product 7',
    image: product7Image
  },
  {
    id: 8,
    name: 'Product 8',
    image: product8Image
  },
  {
    id: 9,
    name: 'Product 9',
    image: product9Image
  },
  {
    id: 10,
    name: 'Product 10',
    image: product10Image
  }
];

// Popular destinations data - 10 items from brand_products
const popularDestinations = [
  {
    id: 1,
    name: 'Product 1',
    image: product1Image,
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Product 2',
    image: product2Image,
    category: 'Accessories'
  },
  {
    id: 3,
    name: 'Product 3',
    image: product3Image,
    category: 'Gaming'
  },
  {
    id: 4,
    name: 'Product 4',
    image: product4Image,
    category: 'Kitchen'
  },
  {
    id: 5,
    name: 'Product 5',
    image: product5Image,
    category: 'Audio'
  },
  {
    id: 6,
    name: 'Product 6',
    image: product6Image,
    category: 'Electronics'
  },
  {
    id: 7,
    name: 'Product 7',
    image: product7Image,
    category: 'Accessories'
  },
  {
    id: 8,
    name: 'Product 8',
    image: product8Image,
    category: 'Gaming'
  },
  {
    id: 9,
    name: 'Product 9',
    image: product9Image,
    category: 'Kitchen'
  },
  {
    id: 10,
    name: 'Product 10',
    image: product10Image,
    category: 'Audio'
  }
];

const ExportPage: React.FC = () => {
  const navigate = useNavigate();

  const handleItemClick = (itemId: number) => {
    navigate(`/product/${itemId}`);
  };

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
                  <div 
                    key={item.id} 
                    className="brand-item"
                    onClick={() => handleItemClick(item.id)}
                    style={{ cursor: 'pointer' }}
                  >
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
          
        </div>
        <Footer />
      </div>
    </Layout>
  );
};

export default ExportPage;
