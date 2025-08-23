import React, { useState } from 'react';
import './AccountPage.css';
import Footer from '../components/sections/Footer';
import Alert from '../components/ui/Alert';
import UserProfile from '../components/ui/UserProfile';
import { useAuth } from '../context/AuthContext';

interface AccountPageProps {
  onRegisterClick: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ onRegisterClick }) => {
  const { user, login, isLoading } = useAuth();
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
        
        // You can redirect or update UI here
        // For now, we'll just show success message
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

  // If user is logged in, show user profile
  if (user) {
    return (
      <div className="account-page">
        <div className="container mt-4">
          <UserProfile />
        </div>
        <Footer />
      </div>
    );
  }

  // If user is not logged in, show login form
  return (
    <div className="account-page">
      <div className="account-container">
        <div className="card">
          <div className="card-header bg-danger">
            <h5 className="text-center text-white">Đăng nhập</h5>
          </div>
          <div className="p-2">
            {alert.show && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={closeAlert}
              />
            )}
            
            <form action="" method="POST" onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="username">Tên đăng nhập</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="username" 
                  id="username"
                  placeholder="Nhập tên đăng nhập" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="password">Mật khẩu</label>
                <input 
                  type="password" 
                  className="form-control" 
                  name="password" 
                  id="password"
                  placeholder="Nhập mật khẩu" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <button 
                  type="submit" 
                  name="submit" 
                  className="btn btn-outline-danger w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang đăng nhập...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-2 border-top border-light-subtle text-center p-2">
              <span>Bạn không có tài khoản? <a href="#" onClick={onRegisterClick} className="text-decoration-none text-danger fw-semibold">Đăng ký ngay</a></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AccountPage;
