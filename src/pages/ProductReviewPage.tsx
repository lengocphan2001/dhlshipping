import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { apiService } from '../services/api';
import { Product, ProductReview } from '../types';
import { getImageUrl } from '../config/environment';
import './ProductReviewPage.css';
import Footer from '../components/sections/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProductReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review form state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Review tags
  const reviewTags = [
    'Chất lượng SP tuyệt vời!',
    'Đóng gói đẹp và rất chắc chắn!',
    'Shop phục vụ rất tốt và có tâm!',
    'SP chất lượng, rất đáng tiền!',
    'Thời gian giao hàng nhanh!'
  ];

  useEffect(() => {
    fetchProductAndReviews();
  }, [id]);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        throw new Error('Product ID is required');
      }

      // Fetch product details
      const productResponse = await apiService.getProduct(parseInt(id));
      if (productResponse.success) {
        setProduct(productResponse.data);
      } else {
        throw new Error('Failed to fetch product');
      }

      // Fetch product reviews
      const reviewsResponse = await apiService.getProductReviews(parseInt(id));
      if (reviewsResponse.success) {
        setReviews(reviewsResponse.data.reviews);
      } else {
        setReviews([]); // Set empty array if no reviews
      }

    } catch (error) {
      console.error('Error fetching product and reviews:', error);
      setError(error instanceof Error ? error.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleTagClick = (tag: string) => {
    // Replace the entire textarea content with the selected tag
    setReviewText(tag);
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user) {
      showToast('warning', 'Vui lòng đăng nhập để đánh giá sản phẩm');
      navigate('/login');
      return;
    }

    if (!product || !rating || !reviewText.trim()) {
      showToast('warning', 'Vui lòng chọn số sao và nhập đánh giá');
      return;
    }

    try {
      setSubmitting(true);

      // Check if the reviewText matches any of the predefined tags
      const selectedTag = reviewTags.find(tag => reviewText === tag);

      const reviewData = {
        productId: product.id,
        userId: parseInt(user.id), // Add user ID to the review data
        rating,
        comment: reviewText
      };

      console.log('Submitting review data:', reviewData);

      const response = await apiService.createProductReview(reviewData);

      if (response.success) {
        // Reset form
        setRating(0);
        setReviewText('');

        // Refresh reviews
        await fetchProductAndReviews();

        showToast('success', 'Đánh giá đã được gửi thành công!');
      } else {
        throw new Error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.';
      showToast('error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={interactive ? () => handleStarClick(i) : undefined}
          style={interactive ? { cursor: 'pointer' } : {}}
        />
      );
    }
    return stars;
  };

  const renderSimpleReview = (review: ProductReview) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    // Parse tags if they exist
    const parseTags = (tags: any) => {
      if (!tags) return [];
      if (Array.isArray(tags)) return tags;
      try {
        return JSON.parse(tags);
      } catch {
        return [];
      }
    };

    const reviewTags = parseTags(review.tags);

    return (
      <div key={review.id} className="simple-review">
        <div className="simple-review-date">
          {formatDate(review.createdAt)}
        </div>
        <div className="simple-review-rating">
          <span className="simple-review-rating-number">{review.rating}</span>
          <i className="fas fa-star simple-review-rating-star"></i>
          <div className="simple-review-text">
            - {review.comment}
          </div>
        </div>
        {reviewTags.length > 0 && (
          <div className="review-tags">
            {reviewTags.map((tag: string, index: number) => (
              <span key={index} className="review-tag-display">{tag}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numericPrice);
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

  if (error || !product) {
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
                <img src={getImageUrl(product.image || '')} alt={product.name} />
              </div>
            </div>

            <div className="product-info">
              <h1 className="product-title">{product.name} (Mã sản phẩm: @DHL{product.id})</h1>
              <div className="product-rating">
                <span className="review-count">({reviews.length} lượt đánh giá)</span>
              </div>

              {isAuthenticated ? (
                <div className="review-form-section">
                  <div className="review-form-container">
                    <div className="star-rating-section">
                      <div className="stars-container">
                        {renderStars(rating, true)}
                      </div>
                    </div>
                    <div className="review-tags-section">
                      <div className="tags-container">
                        {reviewTags.map((tag, index) => (
                          <button
                            key={index}
                            className={`review-tag ${reviewText.includes(tag) ? 'selected' : ''}`}
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="review-text-section">
                      <textarea
                        className="review-textarea"
                        placeholder="Để lại đánh giá chi tiết"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={5}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="submit-section">
                      <button
                        className="submit-review-btn"
                        onClick={handleSubmitReview}
                        disabled={submitting || !rating || !reviewText.trim()}
                      >
                        {submitting ? 'Đang gửi...' : 'Đánh giá sản phẩm'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="review-form-section">
                  <div className="review-form-container">
                    <p style={{ textAlign: 'center', color: '#666' }}>
                      Vui lòng <button
                        onClick={() => navigate('/login')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#007bff',
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }}
                      >
                        đăng nhập
                      </button> để đánh giá sản phẩm
                    </p>
                  </div>
                </div>
              )}

            </div>
            <br />
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <p>Chưa có đánh giá nào cho sản phẩm này.</p>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map((review) => renderSimpleReview(review))}
              </div>
            )}
          </div>

        </div>
        <Footer />
      </div>
    </Layout>
  );
};

export default ProductReviewPage;
