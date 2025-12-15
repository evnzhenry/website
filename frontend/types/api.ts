// API Response Types

export interface PayoutAccount {
    provider_id: string
    account_number: string
    account_name: string
    bank_name?: string
}

export interface CreditorAccount {
    id: number
    type: 'bank' | 'mobile_money'
    name: string
    provider_name?: string
    account_number: string
    currency: string
    is_default: boolean
    created_at: string
}

export interface TimelineEvent {
    type: string
    timestamp: string
    user: string
    status?: string
}

export interface LoanApplication {
    id: number
    full_name: string
    date_of_birth: string
    gender?: string
    primary_phone: string
    secondary_phone?: string
    email: string
    street_address?: string
    city?: string
    state?: string
    zip_code?: string
    loan_amount: number
    loan_purpose?: string
    source?: string
    created_at: string
    status?: string
    national_id?: string
    employment_status?: string
    monthly_income?: string
    employer?: string
    repayment_period?: string
    payout_account?: PayoutAccount
    national_id_file?: string
    photo_file?: string
    timeline?: TimelineEvent[]
}

export interface ApplicationSubmitRequest {
    full_name: string
    date_of_birth: string
    national_id?: string
    gender?: string
    primary_phone: string
    secondary_phone?: string
    email: string
    street_address?: string
    city?: string
    state?: string
    zip_code?: string
    loan_amount: number
    loan_purpose?: string
    employment_status?: string
    monthly_income?: string
    employer?: string
    repayment_period?: string
    has_existing_loans?: boolean
    // Disbursement Details
    disbursement_method?: 'bank' | 'mobile_money'
    bank_name?: string
    bank_account_number?: string
    bank_account_name?: string
    mm_phone_number?: string
    mm_registered_name?: string
}

export interface ApplicationSubmitResponse {
    id: number
    compliance: {
        passed: boolean
        checks: Array<{ name: string; passed: boolean; reason?: string }>
    }
    credit: {
        score: number
        report?: Record<string, unknown>
    }
    decision: {
        approved: boolean
        reason?: string
        amount?: number
    }
}

export interface OTPRequestRequest {
    email: string
}

export interface OTPRequestResponse {
    success: boolean
    message: string
    otpKey?: string
}

export interface OTPVerifyRequest {
    email: string
    otp: string
}

export interface OTPVerifyResponse {
    success: boolean
    message: string
    token: string
    applications: LoanApplication[]
}

export interface LoanStatusResponse {
    success: boolean
    applications: LoanApplication[]
}

export interface ContactSubmitRequest {
    name: string
    email: string
    phone: string
    subject: string
    message: string
}

export interface ContactMessage {
    id: number
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    seen: boolean
    created_at: string
}

export interface ContactSubmitResponse {
    success: boolean
    message: string
}

export interface APIError {
    error: string
    remaining_seconds?: number
}

export interface AdminLoginRequest {
    email: string
    password?: string
}

export interface AdminLoginResponse {
    success: boolean
    token: string
    user: {
        id: number
        email: string
        role: string
    }
}

export interface AdminDashboardStats {
    totalApplications: number
    pendingApplications: number
    approvedApplications: number
    rejectedApplications: number
    totalDisbursed: number
    recentApplications: LoanApplication[]
}
