import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Alert from './Alert';

const UserProfile: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
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

  if (!user) return null;

  return (
    <div className="user-profile">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}
      
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="fas fa-user me-2"></i>
            Thông tin tài khoản
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Tên đăng nhập:</label>
                <p className="form-control-plaintext">{user.username}</p>
              </div>
              
              {user.email && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Email:</label>
                  <p className="form-control-plaintext">{user.email}</p>
                </div>
              )}
              
              {/* Name field removed as it's not in our User interface */}
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-bold">Vai trò:</label>
                <p className="form-control-plaintext">
                  <span className={`badge bg-${user.role === 'ADMIN' ? 'danger' : 'primary'}`}>
                    {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </p>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Trạng thái:</label>
                <p className="form-control-plaintext">
                  <span className={`badge bg-${user.isActive ? 'success' : 'warning'}`}>
                    {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </p>
              </div>
              
              {/* Referral code field removed as it's not in our User interface */}
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="mb-3">
                <label className="form-label fw-bold">Ngày tham gia:</label>
                <p className="form-control-plaintext">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary"
              onClick={() => {/* TODO: Implement edit profile */}}
              disabled={isLoading}
            >
              <i className="fas fa-edit me-2"></i>
              Chỉnh sửa thông tin
            </button>
            
            <button
              className="btn btn-outline-warning"
              onClick={() => {/* TODO: Implement change password */}}
              disabled={isLoading}
            >
              <i className="fas fa-key me-2"></i>
              Đổi mật khẩu
            </button>
            
            <button
              className="btn btn-outline-danger"
              onClick={() => setShowLogoutConfirm(true)}
              disabled={isLoading}
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận đăng xuất</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLogoutConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn đăng xuất?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang đăng xuất...
                    </>
                  ) : (
                    'Đăng xuất'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
