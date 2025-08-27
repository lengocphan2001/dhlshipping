import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Product, ProductCreateRequest } from '../types';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import { getApiUrl, getImageUrl } from '../config/environment';
import './ProductManagementPage.css';

const ProductManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<ProductCreateRequest>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 0
  });



  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, entriesPerPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: entriesPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory })
      });

      const response = await fetch(getApiUrl(`/products?${params}`), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', response.status, errorText);

        if (response.status === 403) {
          throw new Error('Access denied. Please login as admin user.');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const result = await response.json();

      if (result.success) {
        setProducts(result.data.products);
        setTotalProducts(result.data.pagination.total);
        setTotalPages(result.data.pagination.pages);
      } else {
        throw new Error(result.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh hợp lệ');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const uploadUrl = getApiUrl('/upload');

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }
    
    return result.data.url;
  };

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let imageUrl = formData.image;

      // Upload image if selected
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

             const response = await fetch(getApiUrl('/products'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create product: ${response.status} ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          description: '',
          price: 0,
          image: '',
          category: '',
          stock: 0
        });
        setSelectedImage(null);
        setImagePreview('');
        await fetchProducts();
      } else {
        throw new Error(result.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error instanceof Error ? error.message : 'Failed to create product');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      image: product.image || '',
      category: product.category || '',
      stock: product.stock
    });
    setImagePreview(product.image || '');
    setSelectedImage(null);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let imageUrl = formData.image;

      // Upload new image if selected
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

             const response = await fetch(getApiUrl(`/products/${editingProduct.id}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update product: ${response.status} ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        setShowEditModal(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          description: '',
          price: 0,
          image: '',
          category: '',
          stock: 0
        });
        setSelectedImage(null);
        setImagePreview('');
        await fetchProducts();
      } else {
        throw new Error(result.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error instanceof Error ? error.message : 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

             const response = await fetch(getApiUrl(`/products/${productId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete product: ${response.status} ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        await fetchProducts();
      } else {
        throw new Error(result.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numericPrice);
  };

  const calculateDisplayValues = () => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalProducts);
    return { startIndex, endIndex };
  };

  const { startIndex, endIndex } = calculateDisplayValues();

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      stock: 0
    });
    setSelectedImage(null);
    setImagePreview('');
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminHeader
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
          user={user || { id: '', username: '', role: 'ADMIN', isActive: true, createdAt: '' }}
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className={`admin-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <AdminSidebar collapsed={sidebarCollapsed} />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <AdminHeader
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
          user={user || { id: '', username: '', role: 'ADMIN', isActive: true, createdAt: '' }}
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className={`admin-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <AdminSidebar collapsed={sidebarCollapsed} />
          <div className="loading-container">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Lỗi: {error}</p>
              <button onClick={fetchProducts} className="retry-btn">
                <i className="fas fa-redo"></i>
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminHeader
        onToggleSidebar={handleToggleSidebar}
        onLogout={handleLogout}
        user={user || { id: '', username: '', role: 'ADMIN', isActive: true, createdAt: '' }}
        sidebarCollapsed={sidebarCollapsed}
      />
      <div className={`admin-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <AdminSidebar collapsed={sidebarCollapsed} />
        <div className="user-management-container">
          {/* Header */}
          <div className="page-header">
            <div className="page-title">
              <h1>Quản lý sản phẩm</h1>
            </div>
            <div className="breadcrumb">
              <span>Sản phẩm</span>
              <span className="separator">›</span>
              <span>Danh sách sản phẩm</span>
            </div>
          </div>

          {/* Controls */}
          <div className="table-controls">
            <div className="entries-control">
              <label>Hiển thị</label>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>mục</span>
            </div>
            <div className="search-control">
              <label>Tìm kiếm:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
              />
            </div>
            <div className="category-filter">
              <label>Danh mục:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                <option value="Electronics">Điện tử</option>
                <option value="Clothing">Quần áo</option>
                <option value="Home & Garden">Nhà cửa & Vườn</option>
                <option value="Sports">Thể thao</option>
                <option value="Books">Sách</option>
                <option value="Toys">Đồ chơi</option>
                <option value="Health & Beauty">Sức khỏe & Làm đẹp</option>
                <option value="Automotive">Ô tô</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            <button
              className="add-btn"
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
            >
              <i className="fas fa-plus"></i>
              Thêm sản phẩm
            </button>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Thời gian tạo</th>
                  <th>Cập nhật lần cuối</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>
                      {product.image ? (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="product-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="product-image-placeholder">
                          <i className="fas fa-image"></i>
                          <span>Không có hình</span>
                        </div>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category || 'N/A'}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                        {product.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td>{new Date(product.createdAt).toLocaleString('vi-VN')}</td>
                    <td>{new Date(product.updatedAt).toLocaleString('vi-VN')}</td>
                    <td className="actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditProduct(product)}
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-pencil-alt"></i>
                        Chỉnh sửa
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="table-summary">
            <p>
              Hiển thị {startIndex + 1} đến {endIndex}
              trong tổng số {totalProducts} sản phẩm
            </p>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Thêm sản phẩm mới</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả sản phẩm"
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Giá *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tồn kho *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Electronics">Điện tử</option>
                    <option value="Clothing">Quần áo</option>
                    <option value="Home & Garden">Nhà cửa & Vườn</option>
                    <option value="Sports">Thể thao</option>
                    <option value="Books">Sách</option>
                    <option value="Toys">Đồ chơi</option>
                    <option value="Health & Beauty">Sức khỏe & Làm đẹp</option>
                    <option value="Automotive">Ô tô</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Hình ảnh sản phẩm</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                      id="image-upload-add"
                    />
                    <label htmlFor="image-upload-add" className="image-upload-label">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Chọn hình ảnh</span>
                    </label>
                    {imagePreview && (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview('');
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                    {!imagePreview && formData.image && (
                      <div className="image-preview">
                        <img src={getImageUrl(formData.image)} alt="Current" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => {
                            setFormData({ ...formData, image: '' });
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                    {!imagePreview && !formData.image && (
                      <div className="image-preview-placeholder">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Chưa có hình ảnh</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddProduct}
                disabled={!formData.name || (typeof formData.price === 'number' ? formData.price <= 0 : parseFloat(formData.price as string) <= 0)}
              >
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Chỉnh sửa sản phẩm</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả sản phẩm"
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Giá *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tồn kho *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Electronics">Điện tử</option>
                    <option value="Clothing">Quần áo</option>
                    <option value="Home & Garden">Nhà cửa & Vườn</option>
                    <option value="Sports">Thể thao</option>
                    <option value="Books">Sách</option>
                    <option value="Toys">Đồ chơi</option>
                    <option value="Health & Beauty">Sức khỏe & Làm đẹp</option>
                    <option value="Automotive">Ô tô</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Hình ảnh sản phẩm</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                      id="image-upload-edit"
                    />
                    <label htmlFor="image-upload-edit" className="image-upload-label">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Chọn hình ảnh mới</span>
                    </label>
                    {imagePreview && (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview('');
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                    {!imagePreview && formData.image && (
                      <div className="image-preview">
                        <img src={getImageUrl(formData.image)} alt="Current" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => {
                            setFormData({ ...formData, image: '' });
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                    {!imagePreview && !formData.image && (
                      <div className="image-preview-placeholder">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Chưa có hình ảnh</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleUpdateProduct}
                disabled={!formData.name || (typeof formData.price === 'number' ? formData.price <= 0 : parseFloat(formData.price as string) <= 0)}
              >
                Cập nhật sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;
