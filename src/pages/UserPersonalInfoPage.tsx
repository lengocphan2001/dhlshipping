import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';
import Layout from '../components/layout/Layout';
import Footer from '../components/sections/Footer';
import './UserPersonalInfoPage.css';

interface UserData {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  bankLink?: string;
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

const UserPersonalInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProfile();
        
        if (response.success && response.data) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleEditField = (field: string, currentValue?: string) => {
    setEditingField(field);
    
    if (field === 'fullName') {
      setEditFormData({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || ''
      });
    } else if (field === 'bankAccount') {
      setEditFormData({
        bankName: userData?.bankName || '',
        accountNumber: userData?.accountNumber || '',
        accountHolderName: userData?.accountHolderName || ''
      });
    } else {
      setEditValue(currentValue || '');
    }
  };

  const handleSaveField = async () => {
    if (!editingField) return;

    try {
      setUpdating(true);
      
      let updateData: any = {};
      
      if (editingField === 'fullName') {
        updateData.firstName = editFormData.firstName.trim();
        updateData.lastName = editFormData.lastName.trim();
      } else if (editingField === 'bankAccount') {
        updateData.bankName = editFormData.bankName.trim();
        updateData.accountNumber = editFormData.accountNumber.trim();
        updateData.accountHolderName = editFormData.accountHolderName.trim();
      } else if (editingField === 'email') {
        updateData.email = editValue.trim();
      } else if (editingField === 'phone') {
        updateData.phone = editValue.trim();
      } else if (editingField === 'gender') {
        updateData.gender = editValue.trim();
      } else {
        updateData[editingField] = editValue.trim();
      }

      // Call API to update the field
      const response = await apiService.updateUserProfile(updateData);
      
      if (response.success && response.data && response.data.user) {
        setUserData(response.data.user);
        showToast('success', 'Cập nhật thông tin thành công!');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
      
      setEditingField(null);
      setEditValue('');
      setEditFormData({});
    } catch (error) {
      console.error('Error updating field:', error);
      showToast('error', 'Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
    setEditFormData({});
  };

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      fullName: 'Họ tên thật',
      bankAccount: 'Tài khoản ngân hàng',
      email: 'Email',
      phone: 'Số điện thoại',
      gender: 'Giới tính'
    };
    return labels[field] || field;
  };

  if (!user) {
    return (
      <Layout>
        <div className="user-personal-info-page">
          <div className="container">
            <div className="error-message">
              <h2>Vui lòng đăng nhập để xem thông tin cá nhân</h2>
              <button onClick={() => navigate('/login')} className="login-btn">
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="user-personal-info-page">
          <div className="container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải thông tin...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="user-personal-info-page">
        <div className="container">
          {/* Header */}
          <div className="page-header">
            <div className="header-left">
              <button onClick={() => navigate('/profile')} className="back-btn">
                <i className="fas fa-arrow-left"></i>
                Quay lại
              </button>
              <h1>Thông tin cá nhân</h1>
            </div>
          </div>

                     {/* Personal Information List */}
           <div className="info-section">
             <div className="info-list">
                                                             {/* Full Name */}
                <div className="info-item" onClick={() => handleEditField('fullName')}>
                  <div className="info-label">Họ tên thật</div>
                  <div className="info-content">
                    <div className="info-value">
                      {userData?.firstName && userData?.lastName 
                        ? `${userData.firstName} ${userData.lastName}`
                        : userData?.username || 'Chưa thiết lập'
                      }
                    </div>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>

                              {/* Gender */}
                <div className="info-item" onClick={() => handleEditField('gender', userData?.gender || '')}>
                  <div className="info-label">Giới tính</div>
                  <div className="info-content">
                    <div className="info-value">
                      {userData?.gender || 'Chưa thiết lập'}
                    </div>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>

                {/* Bank Account */}
                <div className="info-item" onClick={() => handleEditField('bankAccount')}>
                  <div className="info-label">Tài khoản ngân hàng</div>
                  <div className="info-content">
                    <div className="info-value">
                      {userData?.bankName && userData?.accountNumber 
                        ? `${userData.bankName} - ${userData.accountNumber}`
                        : 'Chưa thiết lập'
                      }
                    </div>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>

               {/* Email */}
               <div className="info-item" onClick={() => handleEditField('email', userData?.email || '')}>
                 <div className="info-label">Email</div>
                 <div className="info-content">
                   <div className="info-value">
                     {userData?.email || 'Chưa thiết lập'}
                   </div>
                   <i className="fas fa-chevron-right"></i>
                 </div>
               </div>

               {/* Phone */}
               <div className="info-item" onClick={() => handleEditField('phone', userData?.phone || '')}>
                 <div className="info-label">Số điện thoại</div>
                 <div className="info-content">
                   <div className="info-value">
                     {userData?.phone || 'Chưa thiết lập'}
                   </div>
                   <i className="fas fa-chevron-right"></i>
                 </div>
               </div>

               {/* Username */}
               <div className="info-item">
                 <div className="info-label">Tên đăng nhập</div>
                 <div className="info-content">
                   <div className="info-value">{userData?.username}</div>
                   <i className="fas fa-chevron-right"></i>
                 </div>
               </div>

              
            </div>
          </div>
          
        </div>
        
      </div>

      {/* Edit Modal */}
      {editingField && (
        <div className="edit-modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h3>Chỉnh sửa {getFieldLabel(editingField)}</h3>
              <button className="close-btn" onClick={handleCancelEdit}>
                <i className="fas fa-times"></i>
              </button>
            </div>
                         <div className="edit-modal-body">
               {editingField === 'fullName' ? (
                 <div className="form-fields">
                   <div className="form-group">
                     <label>Họ</label>
                     <input
                       type="text"
                       value={editFormData.firstName || ''}
                       onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                       placeholder="Nhập họ"
                       className="edit-input"
                     />
                   </div>
                   <div className="form-group">
                     <label>Tên</label>
                     <input
                       type="text"
                       value={editFormData.lastName || ''}
                       onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                       placeholder="Nhập tên"
                       className="edit-input"
                     />
                   </div>
                 </div>
               ) : editingField === 'bankAccount' ? (
                 <div className="form-fields">
                   <div className="form-group">
                     <label>Tên ngân hàng</label>
                     <input
                       type="text"
                       value={editFormData.bankName || ''}
                       onChange={(e) => setEditFormData({...editFormData, bankName: e.target.value})}
                       placeholder="Nhập tên ngân hàng"
                       className="edit-input"
                     />
                   </div>
                   <div className="form-group">
                     <label>Số tài khoản</label>
                     <input
                       type="text"
                       value={editFormData.accountNumber || ''}
                       onChange={(e) => setEditFormData({...editFormData, accountNumber: e.target.value})}
                       placeholder="Nhập số tài khoản"
                       className="edit-input"
                     />
                   </div>
                   <div className="form-group">
                     <label>Tên chủ tài khoản</label>
                     <input
                       type="text"
                       value={editFormData.accountHolderName || ''}
                       onChange={(e) => setEditFormData({...editFormData, accountHolderName: e.target.value})}
                       placeholder="Nhập tên chủ tài khoản"
                       className="edit-input"
                     />
                   </div>
                 </div>
               ) : (
                 <div className="form-group">
                   <label>{getFieldLabel(editingField)}</label>
                   <input
                     type="text"
                     value={editValue}
                     onChange={(e) => setEditValue(e.target.value)}
                     placeholder={`Nhập ${getFieldLabel(editingField).toLowerCase()}`}
                     className="edit-input"
                   />
                 </div>
               )}
             </div>
            <div className="edit-modal-footer">
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Hủy
              </button>
                             <button 
                 className="save-btn" 
                 onClick={handleSaveField}
                 disabled={updating || (
                   editingField === 'fullName' 
                     ? (!editFormData.firstName?.trim() && !editFormData.lastName?.trim())
                     : editingField === 'bankAccount'
                     ? (!editFormData.bankName?.trim() && !editFormData.accountNumber?.trim() && !editFormData.accountHolderName?.trim())
                     : !editValue.trim()
                 )}
               >
                 {updating ? 'Đang lưu...' : 'Lưu'}
               </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </Layout>
  );
};

export default UserPersonalInfoPage;
