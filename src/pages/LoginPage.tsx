import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import './LoginPage.css';
import Footer from '../components/sections/Footer';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, user } = useAuth();
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

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

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

      console.log('🔍 LoginPage: Login result:', result);
      console.log('🔍 LoginPage: User data:', result.user);
      console.log('🔍 LoginPage: User role:', result.user?.role);

      if (result.success) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Đăng nhập thành công!'
        });

        // Clear form
        setFormData({ username: '', password: '' });

        // Check if user is admin and show admin button
        if (result.user && result.user.role === 'ADMIN') {
          console.log('👑 LoginPage: Setting admin button to true');
          setIsAdminLoggedIn(true);
        } else {
          console.log('👤 LoginPage: User is not admin, role:', result.user?.role);
        }
      } else {
        setAlert({
          show: true,
          type: 'error',
          message: result.message || 'Đăng nhập thất bại'
        });
      }
    } catch (error) {
      console.error('💥 LoginPage: Error:', error);
      setAlert({
        show: true,
        type: 'error',
        message: 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.'
      });
    }
  };

  const handleAdminRedirect = () => {
    navigate('/admin');
  };

  const closeAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };

  return (
    <Layout>
      <div className="login-page">
        <div className="login-container">
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
                    className={`btn w-100 ${isLoading ? 'btn-secondary' : 'btn-outline-danger'}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner
                        size="small"
                        color="danger"
                        text="Loading..."
                        showText={false}
                      />
                    ) : (
                      'Đăng nhập'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-2 border-top border-light-subtle text-center p-2">
                <span>Bạn không có tài khoản? <Link to="/register" className="text-decoration-none text-danger fw-semibold">Đăng ký ngay</Link></span>
              </div>

              {/* Admin Panel Button - Show only for admin users */}
              {isAdminLoggedIn && (
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    className="btn btn-success w-100"
                    onClick={handleAdminRedirect}
                  >
                    <i className="fas fa-cog me-2"></i>
                    Truy cập Admin Panel
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </Layout>
  );
};

export default LoginPage;
