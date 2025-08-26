import React, { useState, useEffect } from 'react';
import './DepositModal.css';

interface User {
  id: number;
  username: string;
  balance?: number;
}

interface DepositModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (userId: number, amount: number) => Promise<void>;
}

const DepositModal: React.FC<DepositModalProps> = ({ user, isOpen, onClose, onDeposit }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError(null);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers with up to 2 decimal places
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await onDeposit(user.id, parseFloat(amount));
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deposit');
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance: number) => {
    return balance.toLocaleString('vi-VN');
  };

  if (!isOpen || !user) return null;

  const currentBalance = Number(user.balance) || 0;
  const depositAmount = parseFloat(amount) || 0;
  const newBalance = currentBalance + depositAmount;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content deposit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Nạp tiền cho người dùng</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="user-info">
            <div className="user-detail">
              <label>Tên đăng nhập:</label>
              <span>{user.username}</span>
            </div>
            <div className="user-detail">
              <label>Số dư hiện tại:</label>
              <span className="current-balance">{formatBalance(currentBalance)} VNĐ</span>
            </div>
          </div>

                     <div className="form-group">
             <label htmlFor="amount">Số tiền nạp (VNĐ)</label>
             <input
               type="text"
               id="amount"
               value={amount}
               onChange={handleInputChange}
               className="form-control"
               disabled={loading}
             />
           </div>

                     {amount && depositAmount > 0 && (
             <div className="balance-preview">
               <div className="preview-item">
                 <span>Số dư hiện tại:</span>
                 <span>{formatBalance(currentBalance)} VNĐ</span>
               </div>
               <div className="preview-item">
                 <span>Số tiền nạp:</span>
                 <span className="deposit-amount">+{formatBalance(depositAmount)} VNĐ</span>
               </div>
               <div className="preview-item total">
                 <span>Số dư mới:</span>
                 <span className="new-balance">{formatBalance(newBalance)} VNĐ</span>
               </div>
             </div>
           )}

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !amount || parseFloat(amount) <= 0}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Đang nạp tiền...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  Nạp tiền
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;
