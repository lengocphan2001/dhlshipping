import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import './OrderManagementPage.css';

interface Order {
  id: string;
  orderId: string;
  userId: string;
  username: string;
  productName: string;
  amount: number;
  amountPerOrder: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  selectedProducts: number[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const OrderManagementPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Mock data for demonstration
  const mockOrders: Order[] = [
    {
      id: '1',
      orderId: '#202412011200001234',
      userId: '1',
      username: 'user1',
      productName: 'Sản phẩm 1, Sản phẩm 2',
      amount: 150000,
      amountPerOrder: 75000,
      status: 'pending',
      selectedProducts: [1, 2],
      notes: 'Đơn hàng mẫu 1',
      createdAt: '2024-12-01T12:00:00Z',
      updatedAt: '2024-12-01T12:00:00Z'
    },
    {
      id: '2',
      orderId: '#202412011200002345',
      userId: '2',
      username: 'user2',
      productName: 'Sản phẩm 3',
      amount: 200000,
      amountPerOrder: 200000,
      status: 'processing',
      selectedProducts: [3],
      notes: 'Đơn hàng mẫu 2',
      createdAt: '2024-12-01T12:30:00Z',
      updatedAt: '2024-12-01T12:30:00Z'
    },
    {
      id: '3',
      orderId: '#202412011200003456',
      userId: '3',
      username: 'user3',
      productName: 'Sản phẩm 4, Sản phẩm 5',
      amount: 300000,
      amountPerOrder: 150000,
      status: 'completed',
      selectedProducts: [4, 5],
      notes: 'Đơn hàng mẫu 3',
      createdAt: '2024-12-01T13:00:00Z',
      updatedAt: '2024-12-01T13:00:00Z'
    }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await apiService.getOrders(params);
      
      if (response.success) {
        setOrders(response.data.orders || mockOrders);
      } else {
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Không thể tải danh sách đơn hàng');
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      );
      
      showToast('success', 'Cập nhật trạng thái đơn hàng thành công');
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('error', 'Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await apiService.deleteOrder(orderToDelete);
      
      setOrders(prev => prev.filter(order => order.id !== orderToDelete));
      showToast('success', 'Xóa đơn hàng thành công');
    } catch (error) {
      console.error('Error deleting order:', error);
      showToast('error', 'Không thể xóa đơn hàng');
    } finally {
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
    }
  };

  const cancelDeleteOrder = () => {
    setShowDeleteConfirm(false);
    setOrderToDelete(null);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = !searchTerm || 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

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

  if (error && orders.length === 0) {
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
              <button onClick={loadOrders} className="retry-btn">
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
        <div className="order-management-container">
          {/* Header */}
          <div className="page-header">
            <div className="page-title">
              <h1>Quản lý đơn hàng</h1>
            </div>
            <div className="breadcrumb">
              <span>Đơn hàng</span>
              <span className="separator">›</span>
              <span>Danh sách đơn hàng</span>
            </div>
          </div>

          {/* Controls */}
          <div className="table-controls">
            <div className="entries-control">
              <label>Hiển thị</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
                placeholder="Tìm theo mã đơn, tên người dùng..."
              />
            </div>
            <div className="status-filter">
              <label>Trạng thái:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <button
              className="refresh-btn"
              onClick={loadOrders}
              disabled={loading}
            >
              <i className="fas fa-sync-alt"></i>
              Làm mới
            </button>
          </div>

          {/* Orders Table */}
          <div className="table-container">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : (
              <>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Người dùng</th>
                      <th>Sản phẩm</th>
                      <th>Số tiền</th>
                      <th>Trạng thái</th>
                      <th>Ngày tạo</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <span className="order-id">{order.orderId}</span>
                        </td>
                        <td>
                          <div className="user-info">
                            <span className="username">{order.username}</span>
                            <small className="user-id">ID: {order.userId}</small>
                          </div>
                        </td>
                        <td>
                          <div className="product-info">
                            <span className="product-name">{order.productName}</span>
                            <small className="product-count">
                              {order.selectedProducts.length} sản phẩm
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="amount-info">
                            <span className="total-amount">{formatPrice(order.amount)}</span>
                            <small className="per-order">
                              {formatPrice(order.amountPerOrder)}/đơn
                            </small>
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(order.status)}
                        </td>
                        <td>
                          <span className="date">{formatDate(order.createdAt)}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                              className="status-select"
                            >
                              <option value="pending">Chờ xử lý</option>
                              <option value="processing">Đang xử lý</option>
                              <option value="completed">Hoàn thành</option>
                              <option value="cancelled">Đã hủy</option>
                            </select>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="delete-btn"
                              title="Xóa đơn hàng"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}

                {/* Summary */}
                <div className="table-summary">
                  <p>
                    Hiển thị {startIndex + 1} đến {Math.min(startIndex + itemsPerPage, filteredOrders.length)} 
                    trong tổng số {filteredOrders.length} đơn hàng
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        onConfirm={confirmDeleteOrder}
        onCancel={cancelDeleteOrder}
      />
    </div>
  );
};

export default OrderManagementPage;
