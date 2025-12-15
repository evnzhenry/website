"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Loader2, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"

const loanApplicationSchema = z.object({
    // Personal Information
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    nationalId: z.string().min(5, "National ID is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),

    // Employment Information
    employmentStatus: z.enum(["employed", "self-employed", "unemployed"]),
    monthlyIncome: z.string().min(1, "Monthly income is required"),
    employer: z.string().optional(),

    // Loan Details
    loanAmount: z.string().min(1, "Loan amount is required"),
    loanPurpose: z.string().min(10, "Please describe the purpose of the loan"),
    repaymentPeriod: z.enum(["3", "6", "12", "24"]),

    // Disbursement Details
    disbursementMethod: z.enum(["bank", "mobile_money"]),
    bankName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankAccountName: z.string().optional(),
    mmPhoneNumber: z.string().optional(),
    mmRegisteredName: z.string().optional(),

    // Additional Information
    hasExistingLoans: z.boolean(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
    }),
}).refine((data) => {
    if (data.disbursementMethod === "bank") {
        return !!data.bankName && !!data.bankAccountNumber && !!data.bankAccountName;
    }
    if (data.disbursementMethod === "mobile_money") {
        return !!data.mmPhoneNumber && !!data.mmRegisteredName;
    }
    return true;
}, {
    message: "Please fill in all disbursement details",
    path: ["disbursementMethod"],
});

type LoanApplicationData = z.infer<typeof loanApplicationSchema>

export function LoanApplicationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)


    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<LoanApplicationData>({
        resolver: zodResolver(loanApplicationSchema),
        defaultValues: {
            hasExistingLoans: false,
            agreeToTerms: false,
        },
    })

    const employmentStatus = watch("employmentStatus")
    const disbursementMethod = watch("disbursementMethod")
    const [selfieFile, setSelfieFile] = useState<File | null>(null)
    const [idFile, setIdFile] = useState<File | null>(null)

    const onSubmit = async (data: LoanApplicationData) => {
        if (!selfieFile || !idFile) {
            alert("Please upload both your selfie and National ID.")
            return
        }

        setIsSubmitting(true)
        try {
            // 1. Submit Application
            const appResponse = await apiClient.submitApplication({
                full_name: data.fullName,
                email: data.email,
                primary_phone: data.phone,
                national_id: data.nationalId,
                date_of_birth: data.dateOfBirth,
                employment_status: data.employmentStatus,
                monthly_income: data.monthlyIncome,
                employer: data.employer,
                loan_amount: parseFloat(data.loanAmount),
                loan_purpose: data.loanPurpose,
                repayment_period: data.repaymentPeriod,
                has_existing_loans: data.hasExistingLoans,
                // Disbursement
                disbursement_method: data.disbursementMethod as any, // Enum mismatch handling
                bank_name: data.bankName,
                bank_account_number: data.bankAccountNumber,
                bank_account_name: data.bankAccountName,
                mm_phone_number: data.mmPhoneNumber,
                mm_registered_name: data.mmRegisteredName,
            })

            const appId = appResponse.id

            // 2. Upload Documents
            if (selfieFile) {
                await apiClient.uploadDocument(appId, selfieFile, "selfie")
            }
            if (idFile) {
                await apiClient.uploadDocument(appId, idFile, "national_id")
            }

            setSubmitSuccess(true)
            reset()
            setSelfieFile(null)
            setIdFile(null)
            setIdFile(null)
        } catch (error: any) {
            console.error("Submission error:", error)
            alert(error.message || "Failed to submit application. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitSuccess) {
        return (
            <Card className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Application Submitted!</h3>
                <p className="text-muted-foreground mb-6">
                    Thank you for applying. We&apos;ve received your application and will review it within 24 hours.
                    You&apos;ll receive an email confirmation shortly with your application reference number.
                </p>
                <Button onClick={() => setSubmitSuccess(false)}>
                    Submit Another Application
                </Button>
            </Card>
        )
    }

    return (
        <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                                Full Name *
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                {...register("fullName")}
                                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="John Doe"
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email Address *
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                                Phone Number *
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                {...register("phone")}
                                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="+256 XXX XXX XXX"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="nationalId" className="block text-sm font-medium text-foreground mb-2">
                                National ID *
                            </label>
                            <input
                                id="nationalId"
                                type="text"
                                {...register("nationalId")}
                                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="CM12345678"
                            />
                            {errors.nationalId && (
                                <p className="mt-1 text-sm text-red-500">{errors.nationalId.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-foreground mb-2">
                                Date of Birth *
                            </label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                {...register("dateOfBirth")}
                                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            {errors.dateOfBirth && (
                                <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Employment Information */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Employment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="employmentStatus" className="block text-sm font-medium text-foreground mb-2">
                                Employment Status *
                            </label>
                            <select
                                id="employmentStatus"
                                {...register("employmentStatus")}
                                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Select status</option>
                                <option value="employed">Employed</option>
                                <option value="self-employed">Self-Employed</option>
                                <option value="unemployed">Unemployed</option>
                            </select>
                            {errors.employmentStatus && (
                                <p className="mt-1 text-sm text-red-500">{errors.employmentStatus.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="monthlyIncome" className="block text-sm font-medium text-foreground mb-2">
                                Monthly Income (UGX) *
                            </label>
                            <input
                                id="monthlyIncome"
                                type="number"
                                {...register("monthlyIncome")}
                                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="500000"
                            />
                            {errors.monthlyIncome && (
                                <p className="mt-1 text-sm text-red-500">{errors.monthlyIncome.message}</p>
                            )}
                        </div>

                        {(employmentStatus === "employed" || employmentStatus === "self-employed") && (
                            <div className="md:col-span-2">
                                <label htmlFor="employer" className="block text-sm font-medium text-foreground mb-2">
                                    Employer / Business Name
                                </label>
                                <input
                                    id="employer"
                                    type="text"
                                    {...register("employer")}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Company name"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Loan Details */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Loan Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="loanAmount" className="block text-sm font-medium text-foreground mb-2">
                                Loan Amount (UGX) *
                            </label>
                            <input
                                id="loanAmount"
                                type="number"
                                {...register("loanAmount")}
                                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="100000"
                                max="1000000"
                            />
                            {errors.loanAmount && (
                                <p className="mt-1 text-sm text-red-500">{errors.loanAmount.message}</p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">Maximum: UGX 1,000,000</p>
                        </div>

                        <div>
                            <label htmlFor="repaymentPeriod" className="block text-sm font-medium text-foreground mb-2">
                                Repayment Period *
                            </label>
                            <select
                                id="repaymentPeriod"
                                {...register("repaymentPeriod")}
                                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Select period</option>
                                <option value="3">3 months</option>
                                <option value="6">6 months</option>
                                <option value="12">12 months</option>
                                <option value="24">24 months</option>
                            </select>
                            {errors.repaymentPeriod && (
                                <p className="mt-1 text-sm text-red-500">{errors.repaymentPeriod.message}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="loanPurpose" className="block text-sm font-medium text-foreground mb-2">
                                Purpose of Loan *
                            </label>
                            <textarea
                                id="loanPurpose"
                                {...register("loanPurpose")}
                                rows={4}
                                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                placeholder="Please describe how you plan to use this loan..."
                            />
                            {errors.loanPurpose && (
                                <p className="mt-1 text-sm text-red-500">{errors.loanPurpose.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Disbursement Details */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Disbursement Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">
                                How would you like to receive the funds? *
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="bank"
                                        {...register("disbursementMethod")}
                                        className="h-4 w-4 text-primary-500 focus:ring-primary-500"
                                    />
                                    <span>Bank Account</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="mobile_money"
                                        {...register("disbursementMethod")}
                                        className="h-4 w-4 text-primary-500 focus:ring-primary-500"
                                    />
                                    <span>Mobile Money</span>
                                </label>
                            </div>
                            {errors.disbursementMethod && (
                                <p className="mt-1 text-sm text-red-500">{errors.disbursementMethod.message}</p>
                            )}
                        </div>

                        {disbursementMethod === "bank" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Bank Name *</label>
                                    <input
                                        type="text"
                                        {...register("bankName")}
                                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g. Stanbic Bank"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Account Number *</label>
                                    <input
                                        type="text"
                                        {...register("bankAccountNumber")}
                                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Account Number"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-foreground mb-2">Account Name *</label>
                                    <input
                                        type="text"
                                        {...register("bankAccountName")}
                                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Name as it appears on account"
                                    />
                                </div>
                            </>
                        )}

                        {disbursementMethod === "mobile_money" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Mobile Money Number *</label>
                                    <input
                                        type="tel"
                                        {...register("mmPhoneNumber")}
                                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="+256..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Registered Name *</label>
                                    <input
                                        type="text"
                                        {...register("mmRegisteredName")}
                                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Name registered on SIM"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Document Uploads */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Identity Verification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Live Selfie *
                            </label>
                            <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:bg-accent/50 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="user"
                                    onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="selfie-upload"
                                />
                                <label htmlFor="selfie-upload" className="cursor-pointer flex flex-col items-center">
                                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium">
                                        {selfieFile ? selfieFile.name : "Take a Selfie"}
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        Click to capture
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                National ID Photo *
                            </label>
                            <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:bg-accent/50 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="id-upload"
                                />
                                <label htmlFor="id-upload" className="cursor-pointer flex flex-col items-center">
                                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium">
                                        {idFile ? idFile.name : "Upload National ID"}
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        Front side clearly visible
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <input
                                id="hasExistingLoans"
                                type="checkbox"
                                {...register("hasExistingLoans")}
                                className="mt-1 h-4 w-4 text-primary-500 border-input rounded focus:ring-2 focus:ring-primary-500"
                            />
                            <label htmlFor="hasExistingLoans" className="ml-3 text-sm text-foreground">
                                I currently have existing loans with other institutions
                            </label>
                        </div>

                        <div className="flex items-start">
                            <input
                                id="agreeToTerms"
                                type="checkbox"
                                {...register("agreeToTerms")}
                                className="mt-1 h-4 w-4 text-primary-500 border-input rounded focus:ring-2 focus:ring-primary-500"
                            />
                            <label htmlFor="agreeToTerms" className="ml-3 text-sm text-foreground">
                                I agree to the terms and conditions and privacy policy *
                            </label>
                        </div>
                        {errors.agreeToTerms && (
                            <p className="ml-7 text-sm text-red-500">{errors.agreeToTerms.message}</p>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Submitting Application...
                        </>
                    ) : (
                        "Submit Application"
                    )}
                </Button>
            </form>
        </Card>
    )
}
