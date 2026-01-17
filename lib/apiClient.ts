// API Client - Uses same port as frontend (Vite proxy to Node.js backend)
const API_URL = import.meta.env.VITE_API_URL || '';

class APIClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('supabase_token');

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const text = await response.text();
                try {
                    const error = JSON.parse(text);
                    throw new Error(error.error || error.message || 'API request failed');
                } catch (e) {
                    throw new Error(text || 'API request failed');
                }
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

    // Products
    async getProducts() {
        return this.request('/api/products');
    }

    async getProduct(id: string | number) {
        return this.request(`/api/products/${id}`);
    }

    async createProduct(product: any) {
        return this.request('/api/products', {
            method: 'POST',
            body: JSON.stringify(product),
        });
    }

    async updateProduct(id: string | number, product: any) {
        return this.request(`/api/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
        });
    }

    async deleteProduct(id: string | number) {
        return this.request(`/api/products/${id}`, {
            method: 'DELETE',
        });
    }

    // Supplier / Vendor specific
    async getVendorStats(vendorId: string | number) {
        return this.request(`/api/supplier/${vendorId}/stats`);
    }

    async getVendorProducts(vendorId: string | number) {
        return this.request(`/api/supplier/${vendorId}/products`);
    }

    // Kits
    async getKits() {
        return this.request('/api/kits');
    }

    async getVendorKits(vendorId: string | number) {
        return this.request(`/api/kits/vendor/${vendorId}`);
    }

    async createKit(kit: any) {
        return this.request('/api/kits', {
            method: 'POST',
            body: JSON.stringify(kit),
        });
    }

    async updateKit(id: string, kitData: any) {
        return this.request(`/api/kits/${id}`, {
            method: 'PUT',
            body: JSON.stringify(kitData),
        });
    }

    async updateKitImage(kitId: string | number, imageUrl: string) {
        return this.request(`/api/kits/${kitId}/image`, {
            method: 'PUT',
            body: JSON.stringify({ imageUrl }),
        });
    }

    async deleteKit(id: string | number) {
        return this.request(`/api/kits/${id}`, {
            method: 'DELETE',
        });
    }

    // Orders
    async getOrders() {
        return this.request('/api/orders');
    }

    async getOrdersByUser(userId: string | number) {
        return this.request(`/api/orders/user/${userId}`);
    }

    async createOrder(order: any) {
        return this.request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(order),
        });
    }

    async updateOrderStatus(id: string | number, status: string) {
        return this.request(`/api/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // Categories
    async getCategories() {
        return this.request('/api/categories');
    }
}

export const apiClient = new APIClient(API_URL);

export const checkBackendConnection = async (): Promise<boolean> => {
    try {
        const h = await apiClient.health();
        console.log('✅ Connected to MySQL kitech:', h.database);
        return true;
    } catch (error) {
        console.warn('⚠️ kitech backend not available');
        return false;
    }
};
