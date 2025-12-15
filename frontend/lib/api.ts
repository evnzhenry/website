// API client for Stronic Holdings backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export const api = {
    // Base fetch wrapper with error handling
    async fetch(endpoint: string, options: RequestInit = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
        }

        return response.json();
    },

    // Contact form submission
    async submitContact(data: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }) {
        return this.fetch('/api/contacts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Loan application submission
    async submitLoanApplication(formData: FormData) {
        return fetch(`${API_BASE_URL}/api/loans`, {
            method: 'POST',
            body: formData, // Don't set Content-Type for FormData
        }).then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
            }
            return response.json();
        });
    },

    // Loan status checking
    async requestOTP(email: string) {
        return this.fetch('/api/loan-status/request-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async verifyOTP(email: string, otp: string) {
        return this.fetch('/api/loan-status/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        });
    },

    async getLoanStatus(email: string, token: string) {
        return this.fetch(`/api/loan-status/status/${encodeURIComponent(email)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    // Admin API calls
    admin: {
        async login(username: string, password: string) {
            return api.fetch('/api/admin/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
        },

        async getLoans(
            params: { limit?: string; page?: string; q?: string; seen?: 'seen' | 'unseen' | 'all'; status?: 'reviewed' | 'unreviewed'; sort?: string; order?: 'asc' | 'desc' } = {},
            headers: Record<string, string> = {}
        ) {
            const search = new URLSearchParams();
            search.set('limit', params.limit ?? '25');
            if (params.page) search.set('page', params.page);
            if (params.q) search.set('q', params.q);
            if (params.seen && params.seen !== 'all') search.set('seen', params.seen);
            if (params.status) search.set('status', params.status);
            if (params.sort) search.set('sort', params.sort);
            if (params.order) search.set('order', params.order);
            return api.fetch(`/api/admin/loans?${search.toString()}`, { headers });
        },

        async markReviewed(id: number, headers: Record<string, string> = {}) {
            return api.fetch(`/api/admin/loans/${id}/review`, {
                method: 'POST',
                headers,
            });
        },
    },
};

export default api;
