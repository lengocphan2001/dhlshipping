import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import './RegisterPage.css';
import Footer from '../components/sections/Footer';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
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

  const validateForm = () => {
    if (!formData.username.trim()) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Vui lòng nhập tên đăng nhập'
      });
      return false;
    }

    if (formData.username.length < 3) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Tên đăng nhập phải có ít nhất 3 ký tự'
      });
      return false;
    }

    if (!formData.password) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Vui lòng nhập mật khẩu'
      });
      return false;
    }

    if (formData.password.length < 6) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Mật khẩu xác nhận không khớp'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous alerts
    setAlert({ show: false, type: 'info', message: '' });

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        username: formData.username.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        referralCode: formData.referralCode.trim() || undefined
      });

      if (result.success) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Đăng ký thành công! Bạn đã được đăng nhập tự động.'
        });
        
        // Clear form
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          referralCode: ''
        });
        
        // Redirect to home page after successful registration
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setAlert({
          show: true,
          type: 'error',
          message: result.message || 'Đăng ký thất bại'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.'
      });
    }
  };

  const closeAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };

    return (
    <Layout>
      <div className="register-page">
        <div className="register-container">
          <div className="card">
            <div className="card-header bg-warning">
              <h5 className="text-center text-white">Đăng ký</h5>
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

                <div className="form-group mb-3">
                  <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="referralCode">Mã giới thiệu (tùy chọn)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="referralCode"
                    id="referralCode"
                    placeholder="Nhập mã giới thiệu"
                    value={formData.referralCode}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <button
                    type="submit"
                    name="submit"
                    className={`btn w-100 ${isLoading ? 'btn-secondary' : 'btn-outline-warning'}`}
                    disabled={isLoading}
                  >
                                                               {isLoading ? (
                        <LoadingSpinner 
                          size="small" 
                          color="warning" 
                          text="Loading..." 
                          showText={false}
                        />
                      ) : (
                        'Đăng ký'
                      )}
                  </button>
                </div>
              </form>

              <div className="mt-2 border-top border-light-subtle text-center p-2">
                <span>Bạn đã có tài khoản? <Link to="/login" className="text-decoration-none text-warning fw-semibold">Đăng nhập ngay</Link></span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
};

export default RegisterPage;
