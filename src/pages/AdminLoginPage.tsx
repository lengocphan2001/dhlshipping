import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/ui/Alert';
import { openTelegram } from '../config/contact';
import './AdminLoginPage.css';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [alert, setAlert] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({
    show: false,
    type: 'info',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous alerts
    setAlert({ show: false, type: 'info', message: '' });

    // Basic validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Vui lòng nhập đầy đủ thông tin đăng nhập'
      });
      return;
    }

    try {
      const result = await login({
        username: formData.username.trim(),
        password: formData.password
      });

      if (result.success) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Đăng nhập thành công!'
        });
        
        // Clear form
        setFormData({ username: '', password: '' });
        
        // Redirect to admin dashboard after successful login
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        setAlert({
          show: true,
          type: 'error',
          message: result.message || 'Đăng nhập thất bại'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.'
      });
    }
  };

  const closeAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-logo">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h2>Admin Panel</h2>
            <p>Đăng nhập quản trị viên</p>
          </div>
          
          <div className="admin-login-body">
            {alert.show && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={closeAlert}
              />
            )}
            
            <form onSubmit={handleSubmit} className="admin-login-form">
              <div className="form-group">
                <label htmlFor="username">
                  <i className="fas fa-user"></i>
                  Tên đăng nhập
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="username" 
                  id="username"
                  placeholder="Nhập tên đăng nhập admin" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <i className="fas fa-lock"></i>
                  Mật khẩu
                </label>
                <input 
                  type="password" 
                  className="form-input" 
                  name="password" 
                  id="password"
                  placeholder="Nhập mật khẩu" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className="admin-login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Đăng nhập Admin
                  </>
                )}
              </button>
            </form>

            <div className="admin-login-footer">
              <div className="back-to-site">
                <a href="/" className="back-link">
                  <i className="fas fa-arrow-left"></i>
                  Quay lại trang chủ
                </a>
              </div>
              
              <div className="admin-help">
                <p>Bạn cần hỗ trợ?</p>
                <a 
                  href="#" 
                  className="help-link"
                  onClick={(e) => {
                    e.preventDefault();
                    openTelegram();
                  }}
                >
                  <i className="fas fa-headset"></i>
                  Liên hệ hỗ trợ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
