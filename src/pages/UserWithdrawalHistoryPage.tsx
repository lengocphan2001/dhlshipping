import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Footer from '../components/sections/Footer';
import './UserWithdrawalHistoryPage.css';

const UserWithdrawalHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="user-withdrawal-history-page">
          <div className="container">
            <div className="error-message">
              <h2>Vui lòng đăng nhập để xem lịch sử rút tiền</h2>
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
      <div className="user-withdrawal-history-page">
        <div className="container">
          {/* Header */}
          <div className="page-header">
            <div className="header-left">
              <button onClick={() => navigate('/profile')} className="back-btn">
                <i className="fas fa-arrow-left"></i>
                Quay lại
              </button>
              <h1>Lịch sử rút tiền</h1>
            </div>
            <div className="header-right">
              <button onClick={() => navigate('/profile')} className="withdraw-btn">
                <i className="fas fa-money-bill-transfer"></i>
                Rút tiền
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="content-section">
            <div className="empty-state">
              <i className="fas fa-money-bill-transfer"></i>
              <h3>Chưa có lịch sử rút tiền</h3>
              <p>Bạn chưa có giao dịch rút tiền nào. Hãy thực hiện rút tiền đầu tiên!</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default UserWithdrawalHistoryPage;
