import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserEditModal from '../components/ui/UserEditModal';
import DepositModal from '../components/ui/DepositModal';
import './UserManagementPage.css';

interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  balance?: number;
  creditScore?: number;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  isVerified: boolean;
  referralCode?: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedUserForDeposit, setSelectedUserForDeposit] = useState<User | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      console.log('Token found:', token ? 'Yes' : 'No');
      console.log('Token value:', token);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: entriesPerPage.toString(),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await apiService.getUsers({
        page: currentPage,
        limit: entriesPerPage,
        search: searchTerm || undefined
      });

      const data: ApiResponse = response;

      if (data.success && data.data) {
        setUsers(data.data.users);
        setTotalUsers(data.data.pagination.total);
        setTotalPages(data.data.pagination.pages);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchUsers();
      } else {
        setCurrentPage(1); // Reset to first page when searching
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch users when page or entries per page changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage, entriesPerPage]);

  const formatBalance = (balance: number) => {
    return balance.toLocaleString('vi-VN');
  };

  const handleDeposit = (user: User) => {
    setSelectedUserForDeposit(user);
    setDepositModalOpen(true);
  };

  const handleCloseDepositModal = () => {
    setDepositModalOpen(false);
    setSelectedUserForDeposit(null);
  };

  const handleDepositSubmit = async (userId: number, amount: number) => {
    try {
      console.log('handleDepositSubmit called with:', { userId, amount, amountType: typeof amount });
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiService.updateUserBalance(userId, amount);

      if (response.success) {
        // Refresh the users list
        await fetchUsers();
      } else {
        throw new Error(response.message || 'Failed to update balance');
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await apiService.updateUser(selectedUser.id, userData);

      if (response.success) {
        // Refresh the users list
        await fetchUsers();
      } else {
        throw new Error(response.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Calculate display values
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalUsers);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  console.log('UserManagementPage: Rendering, loading:', loading, 'users:', users.length);
  console.log('Current user:', user);
  console.log('User role:', user?.role);

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
              <button onClick={fetchUsers} className="retry-btn">
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
              <h1>Quản lý người dùng</h1>
            </div>
            <div className="breadcrumb">
              <span>Người dùng</span>
              <span className="separator">›</span>
              <span>Danh sách người dùng</span>
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
                placeholder="Tìm kiếm người dùng..."
              />
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="user-table">
              <thead>
                                 <tr>
                   <th>#</th>
                   <th>Username</th>
                   <th>Số điện thoại</th>
                   <th>Tên</th>
                   <th>Số dư</th>
                   <th>Điểm tin nhiệm</th>
                   <th>Tên ngân hàng</th>
                   <th>Số tài khoản</th>
                   <th>Tên chủ tài khoản</th>
                   <th>Thời gian tạo</th>
                   <th>Cập nhật lần cuối</th>
                   <th>Thao tác</th>
                 </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.phone || '-'}</td>
                    <td>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '-'}</td>
                    <td>{user.balance ? formatBalance(user.balance) : '0'}</td>
                    <td>{user.creditScore || 0}</td>
                    <td>{user.bankName || '-'}</td>
                    <td>{user.accountNumber || '-'}</td>
                    <td>{user.accountHolderName || '-'}</td>

                    <td>{new Date(user.createdAt).toLocaleString('vi-VN')}</td>
                    <td>{new Date(user.updatedAt).toLocaleString('vi-VN')}</td>
                    <td className="actions">
                      <button
                        className="action-btn deposit-btn"
                        onClick={() => handleDeposit(user)}
                        title="Nạp tiền"
                      >
                        <i className="fas fa-plus"></i>
                        Nạp tiền
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(user)}
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-pencil-alt"></i>
                        Chỉnh sửa
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
              trong tổng số {totalUsers} mục
            </p>
          </div>
        </div>
      </div>

      {/* User Edit Modal */}
      <UserEditModal
        user={selectedUser}
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveUser}
      />

      {/* Deposit Modal */}
      <DepositModal
        user={selectedUserForDeposit}
        isOpen={depositModalOpen}
        onClose={handleCloseDepositModal}
        onDeposit={handleDepositSubmit}
      />
    </div>
  );
};

export default UserManagementPage;
