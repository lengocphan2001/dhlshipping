import { config } from '../config/config';

export interface User {
  user: boolean | User | undefined;
  token: any;
  id: string;
  username: string;
  email?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
  referralCode?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
  token?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers: defaultHeaders,
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<User>> {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<any>('/auth/profile');
    if (!response.success || !response.data || !response.data.user) {
      throw new Error('Failed to get user profile');
    }
    return response.data.user;
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/auth/profile');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    
    // Transform the response to match the expected format
    if (response.success && response.data && response.data.user) {
      return {
        ...response,
        user: response.data.user
      };
    }
    return response;
  }

  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // Admin-specific methods

  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request('/admin/dashboard/stats');
  }

  // User management methods (for admin panel)
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = queryParams.toString() ? `/users?${queryParams.toString()}` : '/users';
    return this.request(endpoint);
  }

  async getUser(id: number): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: number, userData: any): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async updateUserBalance(userId: number, amount: number, operation: 'add' | 'subtract' | 'set' = 'add'): Promise<ApiResponse<any>> {
    return this.request(`/users/${userId}/balance`, {
      method: 'PATCH',
      body: JSON.stringify({ balance: amount, operation }),
    });
  }

  // Product methods
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);

    const endpoint = queryParams.toString() ? `/products?${queryParams.toString()}` : '/products';
    return this.request(endpoint);
  }

  async getProduct(id: number): Promise<ApiResponse<any>> {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: any): Promise<ApiResponse<any>> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: number, productData: any): Promise<ApiResponse<any>> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: number): Promise<ApiResponse<any>> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Review methods
  async getReviews(params?: {
    page?: number;
    limit?: number;
    productId?: number;
    isApproved?: boolean;
    userId?: number;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.productId) queryParams.append('productId', params.productId.toString());
    if (params?.isApproved !== undefined) queryParams.append('isApproved', params.isApproved.toString());
    if (params?.userId) queryParams.append('userId', params.userId.toString());

    const endpoint = queryParams.toString() ? `/reviews?${queryParams.toString()}` : '/reviews';
    return this.request(endpoint);
  }

  async getProductReviews(productId: number): Promise<ApiResponse<any>> {
    return this.request(`/reviews?productId=${productId}`);
  }

  async createProductReview(reviewData: {
    productId: number;
    userId: number;
    rating: number;
    comment: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getReview(id: number): Promise<ApiResponse<any>> {
    return this.request(`/reviews/${id}`);
  }

  async createReview(reviewData: any): Promise<ApiResponse<any>> {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(id: number, reviewData: any): Promise<ApiResponse<any>> {
    return this.request(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(id: number): Promise<ApiResponse<any>> {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  async approveReview(id: number, isApproved: boolean): Promise<ApiResponse<any>> {
    return this.request(`/reviews/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved }),
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

export const apiService = new ApiService();
