// API Client - Uses same port as frontend (Vite proxy to Node.js backend)
// Now configured to use VITE_API_URL which points directly to backend port
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

class APIClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        console.log('🔧 API Client Initialized with URL:', this.baseURL);
    }

    private normalizePayload(data: any): any {
        if (!data) return data;
        const cleaned = { ...data };

        // Ensure numeric fields are numbers
        if (cleaned.price !== undefined) cleaned.price = parseFloat(cleaned.price);
        if (cleaned.stock !== undefined) cleaned.stock = parseInt(cleaned.stock, 10);
        if (cleaned.quantity !== undefined) cleaned.quantity = parseInt(cleaned.quantity, 10);

        // Ensure strings are strings and trimmed
        if (cleaned.name && typeof cleaned.name === 'string') cleaned.name = cleaned.name.trim();
        if (cleaned.sku && typeof cleaned.sku === 'string') cleaned.sku = cleaned.sku.trim();
        if (cleaned.category && typeof cleaned.category === 'string') cleaned.category = cleaned.category.trim();

        // Recursively clean arrays (like kit products)
        if (cleaned.products && Array.isArray(cleaned.products)) {
            cleaned.products = cleaned.products.map((p: any) => this.normalizePayload(p));
        }

        return cleaned;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('supabase_token');

        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        };

        try {
            console.log(`📡 [API Request] ${options.method || 'GET'} ${endpoint}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const text = await response.text();
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                let errorDetails = null;

                try {
                    const errorJson = JSON.parse(text);
                    errorDetails = errorJson;
                    errorMessage = errorJson.error || errorJson.message || errorMessage;

                    // Capture specific backend validation errors if structured
                    if (errorJson.details) {
                        console.warn('⚠️ Validation details:', errorJson.details);
                    }
                } catch (e) {
                    // Not JSON, use text
                    errorMessage = text || errorMessage;
                }

                console.error(`❌ [API Error] ${errorMessage}`, errorDetails);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            // Enhanced error transformation
            console.error('💥 [Network/System Error]:', error);

            // Check if it's a connection refused error (backend down/wrong port)
            if (error.message && error.message.includes('Failed to fetch')) {
                throw new Error(`No se pudo conectar con el servidor en ${this.baseURL}. Verifique que el backend esté ejecutándose en el puerto correcto.`);
            }

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
        const cleanProduct = this.normalizePayload(product);
        console.log('📤 Sending processed product data:', cleanProduct);
        return this.request('/api/products', {
            method: 'POST',
            body: JSON.stringify(cleanProduct),
        });
    }

    async updateProduct(id: string | number, product: any) {
        const cleanProduct = this.normalizePayload(product);
        return this.request(`/api/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(cleanProduct),
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
        const cleanKit = this.normalizePayload(kit);
        return this.request('/api/kits', {
            method: 'POST',
            body: JSON.stringify(cleanKit),
        });
    }

    async updateKit(id: string, kitData: any) {
        const cleanKit = this.normalizePayload(kitData);
        return this.request(`/api/kits/${id}`, {
            method: 'PUT',
            body: JSON.stringify(cleanKit),
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
        const cleanOrder = this.normalizePayload(order);
        return this.request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(cleanOrder),
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

    // Auth & Users
    async login(email: string, password: string) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async getUsers() {
        return this.request('/api/users');
    }

    async updateUser(id: string | number, data: any) {
        // Only include fields that are present
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.phone) updateData.phone = data.phone;

        return this.request(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    }

    async updateUserStatus(id: string | number, status: string) {
        return this.request(`/api/users/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }
}

export const apiClient = new APIClient(API_URL);

export const checkBackendConnection = async (): Promise<boolean> => {
    try {
        const h = await apiClient.health();
        console.log('✅ Connected to MySQL kitech:', h.database);
        return true;
    } catch (error) {
        console.warn('⚠️ kitech backend not available:', error);
        return false;
    }
};
