import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import ImportPage from '../pages/ImportPage';
import ExportPage from '../pages/ExportPage';
import ProductReviewPage from '../pages/ProductReviewPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import AdminDashboard from '../pages/AdminDashboard';
import UserManagementPage from '../pages/UserManagementPage';
import ProductManagementPage from '../pages/ProductManagementPage';
import ReviewManagementPage from '../pages/ReviewManagementPage';
import OrderManagementPage from '../pages/OrderManagementPage';
import UserOrderHistoryPage from '../pages/UserOrderHistoryPage';
import UserDepositHistoryPage from '../pages/UserDepositHistoryPage';
import UserWithdrawalHistoryPage from '../pages/UserWithdrawalHistoryPage';
import UserPersonalInfoPage from '../pages/UserPersonalInfoPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f8f9fa'
      }}>
        <LoadingSpinner 
          size="large" 
          color="primary" 
          text="Loading..." 
          showText={true}
        />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f8f9fa'
      }}>
        <LoadingSpinner 
          size="large" 
          color="danger" 
          text="Loading..." 
          showText={true}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f8f9fa'
      }}>
        <LoadingSpinner 
          size="large" 
          color="primary" 
          text="Loading..." 
          showText={true}
        />
      </div>
    );
  }

  if (isAuthenticated) {
    // If user is admin, redirect to admin panel
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    // Otherwise redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/admin/login" element={
          <PublicRoute>
            <AdminLoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/import" element={
          <ProtectedRoute>
            <ImportPage />
          </ProtectedRoute>
        } />
        <Route path="/export" element={
          <ProtectedRoute>
            <ExportPage />
          </ProtectedRoute>
        } />
        <Route path="/product/:id" element={
          <ProtectedRoute>
            <ProductReviewPage />
          </ProtectedRoute>
        } />
        <Route path="/product-detail/:id" element={
          <ProtectedRoute>
            <ProductDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/user/orders" element={
          <ProtectedRoute>
            <UserOrderHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/user/deposits" element={
          <ProtectedRoute>
            <UserDepositHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/user/withdrawals" element={
          <ProtectedRoute>
            <UserWithdrawalHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/user/personal-info" element={
          <ProtectedRoute>
            <UserPersonalInfoPage />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <UserManagementPage />
          </AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute>
            <ProductManagementPage />
          </AdminRoute>
        } />
        <Route path="/admin/reviews" element={
          <AdminRoute>
            <ReviewManagementPage />
          </AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute>
            <OrderManagementPage />
          </AdminRoute>
        } />
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
