import axios, { AxiosError, AxiosInstance } from "axios"
import type {
    ApplicationSubmitRequest,
    ApplicationSubmitResponse,
    LoanStatusResponse,
    ContactSubmitRequest,
    ContactSubmitResponse,
    APIError,
    AdminLoginRequest,
    AdminLoginResponse,
    AdminDashboardStats,
    LoanApplication,
    CreditorAccount,
    ContactMessage
} from "@/types/api"

class APIClient {
    private client: AxiosInstance
    private token: string | null = null

    constructor() {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

        this.client = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 30000,
        })

        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                if (this.token) {
                    config.headers.Authorization = `Bearer ${this.token}`
                }
                // Also check localStorage for token if not set in memory (client-side only)
                if (!this.token && typeof window !== 'undefined') {
                    const storedToken = localStorage.getItem('adminToken');
                    if (storedToken) {
                        this.token = storedToken;
                        config.headers.Authorization = `Bearer ${storedToken}`;
                    }
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError<APIError>) => {
                if (error.response) {
                    // Server responded with error
                    const apiError = error.response.data
                    throw new Error(apiError.error || "An error occurred")
                } else if (error.request) {
                    // Request made but no response
                    throw new Error("No response from server. Please check your connection.")
                } else {
                    // Error in request setup
                    throw new Error(error.message || "An error occurred")
                }
            }
        )
    }

    setToken(token: string | null) {
        this.token = token
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('adminToken', token);
            } else {
                localStorage.removeItem('adminToken');
            }
        }
    }

    getToken() {
        return this.token
    }

    // Loan Application
    async submitApplication(data: ApplicationSubmitRequest): Promise<ApplicationSubmitResponse> {
        const response = await this.client.post<ApplicationSubmitResponse>("/applications", data)
        return response.data
    }

    async uploadDocument(applicationId: number, file: File, type: string): Promise<unknown> {
        const formData = new FormData()
        formData.append("application_id", applicationId.toString())
        formData.append("document", file)
        formData.append("type", type)

        const response = await this.client.post("/documents/verify", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response.data
    }

    // OTP Status Check
    // Status Check
    async checkStatus(email: string): Promise<LoanStatusResponse> {
        const response = await this.client.post<LoanStatusResponse>("/loan-status/check", { email })
        return response.data
    }

    // Contact Form
    async submitContact(data: ContactSubmitRequest): Promise<ContactSubmitResponse> {
        const response = await this.client.post<ContactSubmitResponse>("/contacts", data)
        return response.data
    }

    // Admin
    async adminLogin(data: AdminLoginRequest): Promise<AdminLoginResponse> {
        const response = await this.client.post<AdminLoginResponse>("/admin/login", data)
        this.setToken(response.data.token);
        return response.data;
    }

    async getAdminStats(): Promise<AdminDashboardStats> {
        // Mock stats
        return {
            totalApplications: 150,
            pendingApplications: 45,
            approvedApplications: 80,
            rejectedApplications: 25,
            totalDisbursed: 40000000,
            recentApplications: []
        }
    }

    async getApplications(status?: string): Promise<LoanApplication[]> {
        const params = status ? { status } : {}
        const response = await this.client.get("/admin/loans", { params })
        return response.data.rows || []
    }

    async getContacts(status?: string): Promise<ContactMessage[]> {
        const params = status ? { status } : {}
        const response = await this.client.get("/admin/contacts", { params })
        return response.data.rows || []
    }

    async getApplication(id: string | number): Promise<LoanApplication> {
        const response = await this.client.get(`/admin/loans/${id}`)
        return response.data
    }

    async updateApplicationStatus(id: string | number, status: string): Promise<unknown> {
        // Using the review endpoint for now as a proxy for status update
        // In a real scenario, we'd have a dedicated status update endpoint
        const response = await this.client.post(`/admin/loans/${id}/review`, { status })
        return response.data
    }

    // Creditor Accounts
    async getCreditorAccounts(): Promise<CreditorAccount[]> {
        const response = await this.client.get("/admin/creditor-accounts")
        return response.data.rows || []
    }

    async addCreditorAccount(data: Omit<CreditorAccount, 'id' | 'created_at'>): Promise<unknown> {
        const response = await this.client.post("/admin/creditor-accounts", data)
        return response.data
    }

    async setDefaultCreditorAccount(id: number): Promise<unknown> {
        const response = await this.client.post(`/admin/creditor-accounts/${id}/set-default`)
        return response.data
    }

    async deleteCreditorAccount(id: number): Promise<unknown> {
        const response = await this.client.delete(`/admin/creditor-accounts/${id}`)
        return response.data
    }
}

// Export singleton instance
export const apiClient = new APIClient()

// Export class for testing
export default APIClient
