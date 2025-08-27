import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { ProductReview } from '../types';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import './UserManagementPage.css';

const ReviewManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalReviews, setTotalReviews] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [currentPage, searchTerm, selectedProduct, selectedStatus, entriesPerPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: entriesPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedProduct && { product: selectedProduct }),
        ...(selectedStatus && { status: selectedStatus })
      });

      const response = await apiService.getReviews({
        page: currentPage,
        limit: entriesPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedProduct && { productId: parseInt(selectedProduct) }),
        ...(selectedStatus && { isApproved: selectedStatus === 'approved' })
      });

      if (response.success && response.data) {
        setReviews(response.data.reviews);
        setTotalReviews(response.data.pagination.total);
        setTotalPages(response.data.pagination.pages);
      } else {
        throw new Error(response.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReview = async (reviewId: number, isApproved: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiService.approveReview(reviewId, isApproved);

      if (response.success) {
        await fetchReviews();
        showToast('success', `Đánh giá đã được ${isApproved ? 'duyệt' : 'từ chối'} thành công!`);
      } else {
        throw new Error(response.message || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      showToast('error', 'Có lỗi xảy ra khi cập nhật đánh giá');
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    setReviewToDelete(reviewId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      const response = await apiService.deleteReview(reviewToDelete);

      if (response.success) {
        await fetchReviews();
        showToast('success', 'Đánh giá đã được xóa thành công!');
      } else {
        throw new Error(response.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      showToast('error', 'Có lỗi xảy ra khi xóa đánh giá');
    } finally {
      setShowDeleteConfirm(false);
      setReviewToDelete(null);
    }
  };

  const cancelDeleteReview = () => {
    setShowDeleteConfirm(false);
    setReviewToDelete(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? 'filled' : 'empty'}`}
      ></i>
    ));
  };

  const calculateDisplayValues = () => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalReviews);
    return { startIndex, endIndex };
  };

  const { startIndex, endIndex } = calculateDisplayValues();

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminHeader
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
          user={user || { id: '', username: '', role: 'ADMIN', isActive: true, createdAt: '' }}
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className={`admin-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <AdminSidebar collapsed={sidebarCollapsed} />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <AdminHeader
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
          user={user || { id: '', username: '', role: 'ADMIN', isActive: true, createdAt: '' }}
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className={`admin-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <AdminSidebar collapsed={sidebarCollapsed} />
          <div className="loading-container">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Lỗi: {error}</p>
              <button onClick={fetchReviews} className="retry-btn">
                <i className="fas fa-redo"></i>
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminHeader
        onToggleSidebar={handleToggleSidebar}
        onLogout={handleLogout}
        user={user || { id: '', username: '', role: 'ADMIN', isActive: true, createdAt: '' }}
        sidebarCollapsed={sidebarCollapsed}
      />
      <div className={`admin-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <AdminSidebar collapsed={sidebarCollapsed} />
        <div className="user-management-container">
          {/* Header */}
          <div className="page-header">
            <div className="page-title">
              <h1>Quản lý đánh giá sản phẩm</h1>
            </div>
            <div className="breadcrumb">
              <span>Đánh giá</span>
              <span className="separator">›</span>
              <span>Danh sách đánh giá</span>
            </div>
          </div>

          {/* Controls */}
          <div className="table-controls">
            <div className="entries-control">
              <label>Hiển thị</label>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>mục</span>
            </div>
            <div className="search-control">
              <label>Tìm kiếm:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm đánh giá..."
              />
            </div>
            <div className="filter-control">
              <label>Trạng thái:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="approved">Đã duyệt</option>
                <option value="pending">Chờ duyệt</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Sản phẩm</th>
                  <th>Người dùng</th>
                  <th>Đánh giá</th>
                  <th>Bình luận</th>
                  <th>Thời gian tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, index) => (
                  <tr key={review.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>
                      <div className="product-info">

                        <span className="product-name">
                          {review.product?.name || 'Sản phẩm không tồn tại'}
                        </span>
                      </div>
                    </td>
                    <td>

                      <span className="user-name">
                        {review.user?.firstName && review.user?.lastName
                          ? `${review.user.firstName} ${review.user.lastName}`
                          : review.user?.username || 'Người dùng không tồn tại'
                        }
                      </span>
                    </td>
                    <td>
                      <div className="rating-stars">
                        {renderStars(review.rating)}
                        <span className="rating-text">({review.rating}/5)</span>
                      </div>
                    </td>
                    <td>
                      <div className="comment-text">
                        {review.comment || 'Không có bình luận'}
                      </div>
                    </td>
                    <td>{new Date(review.createdAt).toLocaleString('vi-VN')}</td>
                    <td className="actions">
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteReview(review.id)}
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="table-summary">
            <p>
              Hiển thị {startIndex + 1} đến {endIndex}
              trong tổng số {totalReviews} đánh giá
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        onConfirm={confirmDeleteReview}
        onCancel={cancelDeleteReview}
      />
    </div>
  );
};

export default ReviewManagementPage;
