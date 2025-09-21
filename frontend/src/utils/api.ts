// API utility with automatic token refresh
const API_BASE_URL = 'http://localhost:5001/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiClient {
  private async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      localStorage.removeItem('accessToken');
      window.location.href = '/';
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        return true;
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return false;
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
      return false;
    }
  }

  private async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      window.location.href = '/';
      return { success: false, message: 'No token found' };
    }

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
      const data = await response.json();

      // If token is invalid, try to refresh
      if (!data.success && data.message && data.message.includes('token')) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry with new token
          const newToken = localStorage.getItem('accessToken');
          const retryOptions = {
            ...defaultOptions,
            headers: {
              ...defaultOptions.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          };
          
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, retryOptions);
          return await retryResponse.json();
        }
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: `Network error: ${error.message}`,
      };
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
