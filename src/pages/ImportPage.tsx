import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ImageSlider from '../components/ui/ImageSlider';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { apiService } from '../services/api';
import { Product } from '../types';
import './ImportPage.css';
import Footer from '../components/sections/Footer';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts({
        page: currentPage,
        limit: 12
      });

      if (response.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      setError('Error fetching products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: number) => {
    console.log('Product clicked:', productId);
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numericPrice);
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
            {error && (
              <div className="error-message">
                {error}
                <button onClick={() => setError(null)}>×</button>
              </div>
            )}

            {loading ? (
              <div className="loading-container">
                <LoadingSpinner />
              </div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <i className="fas fa-box-open"></i>
                <h3>No products available</h3>
                <p>Please check back later for new products.</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      className="product-card"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="import-product-image">
                        <img 
                          src={product.image || '/images/placeholder.jpg'} 
                          alt={product.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <h3 className="product-title-import">{product.name}</h3>
                        <p className="product-price-import">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      <i className="fas fa-chevron-left"></i> Previous
                    </button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </Layout>
  );
};

export default ImportPage;
