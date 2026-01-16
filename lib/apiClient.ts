// API Client for MySQL Backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class APIClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Health check
    async health() {
        return this.request('/api/health');
    }

    // Users
    async getUsers() {
        return this.request('/api/users');
    }

    async getUser(id: string) {
        return this.request(`/api/users/${id}`);
    }

    async createUser(user: any) {
        return this.request('/api/users', {
            method: 'POST',
            body: JSON.stringify(user),
        });
    }

    async updateUser(id: string, user: any) {
        return this.request(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
        });
    }

    async deleteUser(id: string) {
        return this.request(`/api/users/${id}`, {
            method: 'DELETE',
        });
    }

    // Products
    async getProducts() {
        return this.request('/api/products');
    }

    async getProductsByVendor(vendorId: string) {
        return this.request(`/api/products/vendor/${vendorId}`);
    }

    async createProduct(product: any) {
        return this.request('/api/products', {
            method: 'POST',
            body: JSON.stringify(product),
        });
    }

    async updateProduct(id: string, product: any) {
        return this.request(`/api/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
        });
    }

    async deleteProduct(id: string) {
        return this.request(`/api/products/${id}`, {
            method: 'DELETE',
        });
    }

    // Kits
    async getKits() {
        return this.request('/api/kits');
    }

    async createKit(kit: any) {
        return this.request('/api/kits', {
            method: 'POST',
            body: JSON.stringify(kit),
        });
    }

    async deleteKit(id: string) {
        return this.request(`/api/kits/${id}`, {
            method: 'DELETE',
        });
    }

    // Orders
    async getOrders() {
        return this.request('/api/orders');
    }

    async getOrdersByUser(userId: string) {
        return this.request(`/api/orders/user/${userId}`);
    }

    async createOrder(order: any) {
        return this.request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(order),
        });
    }

    async updateOrderStatus(id: string, status: string) {
        return this.request(`/api/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // Categories
    async getCategories() {
        return this.request('/api/categories');
    }

    // Stats
    async getDashboardStats() {
        return this.request('/api/stats/dashboard');
    }

    // Auth
    async login(email: string, password: string) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }
}

export const apiClient = new APIClient(API_URL);

// Check if backend is available
export const checkBackendConnection = async (): Promise<boolean> => {
    try {
        await apiClient.health();
        console.log('✅ Connected to MySQL backend');
        return true;
    } catch (error) {
        console.warn('⚠️ MySQL backend not available, using demo mode');
        return false;
    }
};
