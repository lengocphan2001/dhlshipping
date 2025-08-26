import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Alert from './Alert';
import './UserProfile.css';
import Footer from '../sections/Footer';

interface UserData {
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

const UserProfile: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({
    show: false,
    type: 'info',
    message: ''
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://ninetails.site/api'}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setUserData(data.data.user);
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setAlert({
          show: true,
          type: 'error',
          message: 'Không thể tải thông tin người dùng'
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      setAlert({
        show: true,
        type: 'success',
        message: 'Đăng xuất thành công!'
      });
      setShowLogoutConfirm(false);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Có lỗi xảy ra khi đăng xuất'
      });
    }
  };

  const closeAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };

  const formatBalance = (balance: number) => {
    return balance.toLocaleString('vi-VN');
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className='container-site'>
        <div className="user-profile">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='container-site'>
      <div className="user-profile">
        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={closeAlert}
          />
        )}

        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="welcome-text">
            Xin chào, {userData?.firstName && userData?.lastName 
              ? `${userData.firstName} ${userData.lastName}` 
              : userData?.username || user.username}
          </div>
          <div className="detail-link">
            Thông tin chi tiết
            <i data-v-ea369608="" className="fa-solid fa-chevron-right" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
          </div>
        </div>

        {/* Account Summary Cards */}
        <div className="account-summary">
          <div className="summary-card">
            <div className="card-label">Số dư</div>
            <div className="card-value">
              {userData?.balance ? formatBalance(userData.balance) : '0'} VNĐ
            </div>
          </div>
          <div className="summary-card">
            <div className="card-label">Điểm tín nhiệm</div>
            <div className="card-value">{userData?.creditScore || 0}</div>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="shortcuts-section">
          <h3 className="welcome-text">Lối tắt của tôi</h3>
          <div className="shortcuts-grid">
            <div className="shortcut-item">
              <div className="shortcut-icon">
                <i className="fa-regular fa-square-plus"></i>
              </div>
              <div className="shortcut-text">Nạp tiền</div>
            </div>
            <div className="shortcut-item">
              <div className="shortcut-icon">
                <i className="fa-solid fa-money-bill-transfer"></i>
              </div>
              <div className="shortcut-text">Rút tiền</div>
            </div>
            <div className="shortcut-item">
              <div className="shortcut-icon">
                <i className="fa-solid fa-chart-simple"></i>
              </div>
              <div className="shortcut-text">Lịch sử đơn hàng</div>
            </div>
            <div className="shortcut-item">
              <div className="shortcut-icon">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="shortcut-text">Tài khoản</div>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div className="menu-section">
          <h3 className="welcome-text">Menu của tôi</h3>
          <div className="menu-list">
            <div className="menu-item">
              <div className="menu-icon">
                <i className="fa-regular fa-user"></i>
              </div>
              <div className="menu-text">Thông tin cá nhân</div>
              <i data-v-ea369608="" className="fa-solid fa-chevron-right"></i>
            </div>
            <div className="menu-item">
              <div className="menu-icon">
                <i className="fa-solid fa-credit-card"></i>
              </div>
              <div className="menu-text">Lịch sử nạp tiền</div>
              <i data-v-ea369608="" className="fa-solid fa-chevron-right"></i>
            </div>
            <div className="menu-item">
              <div className="menu-icon">
                <i className="fa-solid fa-credit-card"></i>
              </div>
              <div className="menu-text">Lịch sử rút tiền</div>
              <i data-v-ea369608="" className="fa-solid fa-chevron-right"></i>
            </div>
            <div className="menu-item">
              <div className="menu-icon">
                <i className="fa-solid fa-chart-simple"></i>
              </div>
              <div className="menu-text">Đơn hàng của tôi</div>
              <i data-v-ea369608="" className="fa-solid fa-chevron-right"></i>
            </div>
            <div className="menu-item">
              <div className="menu-icon">
                <i className="fa-solid fa-headset"></i>
              </div>
              <div className="menu-text">Hỗ trợ khách hàng</div>
              <i data-v-ea369608="" className="fa-solid fa-chevron-right"></i>
            </div>
            <div className="menu-item logout-item" onClick={() => setShowLogoutConfirm(true)}>
              <div className="menu-icon">
                <i className="fa-solid fa-right-from-bracket"></i>
              </div>
              <div className="menu-text logout-text">Đăng xuất</div>
              <i data-v-ea369608="" className="fa-solid fa-chevron-right"></i>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Xác nhận đăng xuất</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn đăng xuất?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="modal-button cancel-button"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Hủy
                </button>
                <button
                  className="modal-button confirm-button"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
