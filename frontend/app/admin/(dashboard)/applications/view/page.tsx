"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { apiClient } from "@/lib/api-client"
import { LoanApplication } from "@/types/api"
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Download,
    User,
    Briefcase,
    CreditCard,
    FileText
} from "lucide-react"

function ApplicationDetailsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get("id")
    const [application, setApplication] = useState<LoanApplication | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        const loadApplication = async () => {
            if (!id) return

            try {
                const data = await apiClient.getApplication(id)
                setApplication(data)
            } catch (error) {
                console.error("Failed to load application:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadApplication()
    }, [id])

    const handleStatusUpdate = async (status: string) => {
        if (!id) return
        if (!confirm(`Are you sure you want to ${status} this application?`)) return

        setIsUpdating(true)
        try {
            await apiClient.updateApplicationStatus(id, status)
            // Refresh data
            const data = await apiClient.getApplication(id)
            setApplication(data)
            alert(`Application ${status} successfully`)
        } catch (error) {
            console.error("Failed to update status:", error)
            alert("Failed to update status")
        } finally {
            setIsUpdating(false)
        }
    }

    if (!id) {
        return <div className="p-8 text-center text-red-500">Invalid application ID</div>
    }

    if (isLoading) {
        return <div className="p-8 text-center">Loading application details...</div>
    }

    if (!application) {
        return <div className="p-8 text-center text-red-500">Application not found</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="self-start sm:self-auto">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Application #{application.id}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {application.status || "Pending"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Applicant Details */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                            <User className="h-5 w-5 text-gray-500" />
                            <h2 className="text-lg font-semibold">Applicant Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="font-medium">{application.full_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{application.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{application.primary_phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">National ID</p>
                                <p className="font-medium">{application.national_id || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date of Birth</p>
                                <p className="font-medium">{application.date_of_birth ? new Date(application.date_of_birth).toLocaleDateString() : "N/A"}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Employment Details */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                            <Briefcase className="h-5 w-5 text-gray-500" />
                            <h2 className="text-lg font-semibold">Employment Details</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Employment Status</p>
                                <p className="font-medium capitalize">{application.employment_status || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Monthly Income</p>
                                <p className="font-medium">UGX {parseInt(application.monthly_income || "0").toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Employer</p>
                                <p className="font-medium">{application.employer || "N/A"}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Loan Details */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                            <CreditCard className="h-5 w-5 text-gray-500" />
                            <h2 className="text-lg font-semibold">Loan Request</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Requested Amount</p>
                                <p className="text-xl font-bold text-primary-600">
                                    UGX {application.loan_amount?.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Repayment Period</p>
                                <p className="font-medium">{application.repayment_period || "N/A"} months</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Purpose</p>
                                <p className="font-medium">{application.loan_purpose}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Disbursement Details */}
                    {application.payout_account && (
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                                <DollarSign className="h-5 w-5 text-gray-500" />
                                <h2 className="text-lg font-semibold">Payout Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Method</p>
                                    <p className="font-medium capitalize">{application.payout_account.provider_id === 'mobile_money' ? 'Mobile Money' : 'Bank Transfer'}</p>
                                </div>
                                {application.payout_account.provider_id === 'mobile_money' ? (
                                    <>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="font-medium">{application.payout_account.account_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Registered Name</p>
                                            <p className="font-medium">{application.payout_account.account_name}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <p className="text-sm text-gray-500">Bank Name</p>
                                            <p className="font-medium">{application.payout_account.bank_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Account Number</p>
                                            <p className="font-medium">{application.payout_account.account_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Account Name</p>
                                            <p className="font-medium">{application.payout_account.account_name}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Actions</h3>
                        <div className="space-y-3">
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusUpdate("approved")}
                                disabled={isUpdating || application.status === 'approved'}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve Application
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                onClick={() => handleStatusUpdate("rejected")}
                                disabled={isUpdating || application.status === 'rejected'}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject Application
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Documents</h3>
                        <div className="space-y-3">
                            {application.national_id_file ? (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium">National ID</span>
                                    </div>
                                    <a href={`http://localhost:5000/${application.national_id_file}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </a>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No National ID uploaded</p>
                            )}

                            {application.photo_file ? (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium">Selfie Photo</span>
                                    </div>
                                    <a href={`http://localhost:5000/${application.photo_file}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </a>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No Selfie uploaded</p>
                            )}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Audit Trail</h3>
                        <div className="space-y-4">
                            {application.timeline && application.timeline.map((event, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="mt-1">
                                        <div className={`h-2 w-2 rounded-full ring-4 ring-opacity-20 ${event.type === 'created' ? 'bg-blue-600 ring-blue-500' :
                                            event.type === 'reviewed' ? 'bg-purple-600 ring-purple-500' :
                                                'bg-gray-600 ring-gray-500'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium capitalize">{event.type.replace('_', ' ')}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(event.timestamp).toLocaleString()} • {event.user}
                                        </p>
                                        {event.status && (
                                            <p className="text-xs font-medium mt-1">Status: {event.status}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// Helper component for DollarSign icon
function DollarSign({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
    )
}

export default function ApplicationDetailsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <ApplicationDetailsContent />
        </Suspense>
    )
}
