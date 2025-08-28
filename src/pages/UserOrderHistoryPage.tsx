import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import Layout from '../components/layout/Layout';
import Footer from '../components/sections/Footer';
import './UserOrderHistoryPage.css';

interface Order {
  id: string;
  orderId: string;
  productName: string;
  amount: number;
  amountPerOrder: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  selectedProducts: number[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const UserOrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders();
      
      if (response.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', className: 'status-pending' },
      processing: { label: 'Đang xử lý', className: 'status-processing' },
      completed: { label: 'Hoàn thành', className: 'status-completed' },
      cancelled: { label: 'Đã hủy', className: 'status-cancelled' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (!user) {
    return (
      <Layout>
        <div className="user-order-history-page">
          <div className="container">
            <div className="error-message">
              <h2>Vui lòng đăng nhập để xem lịch sử đơn hàng</h2>
              <button onClick={() => navigate('/login')} className="login-btn">
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="user-order-history-page">
        <div className="container">
          {/* Header */}
          <div className="page-header">
            <div className="header-left">
              <button onClick={() => navigate('/profile')} className="back-btn">
                <i className="fas fa-arrow-left"></i>
                Quay lại
              </button>
              <h1>Lịch sử đơn hàng</h1>
            </div>
            <div className="header-right">
              <button onClick={() => navigate('/export')} className="new-order-btn">
                <i className="fas fa-plus"></i>
                Đặt đơn mới
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="orders-section">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-shopping-bag"></i>
                <h3>Chưa có đơn hàng nào</h3>
                <p>Bạn chưa có đơn hàng nào. Hãy tạo đơn hàng đầu tiên!</p>
                <button onClick={() => navigate('/export')} className="create-order-btn">
                  <i className="fas fa-plus"></i>
                  Tạo đơn hàng
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">
                        <i className="fas fa-hashtag"></i>
                        {order.orderId}
                      </div>
                      <div className="order-status">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    
                    <div className="order-content">
                      <div className="order-info">
                        <div className="info-row">
                          <span className="label">Sản phẩm:</span>
                          <span className="value">{order.productName}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Số lượng:</span>
                          <span className="value">{order.selectedProducts.length} sản phẩm</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Tổng tiền:</span>
                          <span className="value total-amount">{formatPrice(order.amount)}</span>
                        </div>
                      </div>
                      
                      <div className="order-dates">
                        <div className="date-info">
                          <span className="date-label">Ngày tạo:</span>
                          <span className="date-value">{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default UserOrderHistoryPage;
