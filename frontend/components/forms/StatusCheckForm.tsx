"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Loader2, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"

const checkStatusSchema = z.object({
    email: z.string().email("Invalid email address"),
})

type CheckStatusData = z.infer<typeof checkStatusSchema>

import { LoanApplication } from "@/types/api"

export function StatusCheckForm() {
    const [step, setStep] = useState<"input" | "results">("input")
    const [isLoading, setIsLoading] = useState(false)
    const [applications, setApplications] = useState<LoanApplication[]>([])
    const [error, setError] = useState<string | null>(null)

    const form = useForm<CheckStatusData>({
        resolver: zodResolver(checkStatusSchema),
    })

    const onCheckStatus = async (data: CheckStatusData) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await apiClient.checkStatus(data.email)
            setApplications(response.applications)
            setStep("results")
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to check status"
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusBadge = (status?: string) => {
        const s = (status || "Pending").toLowerCase()
        if (s.includes("disbursed")) {
            return (
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    {status}
                </div>
            )
        }
        if (s.includes("approved")) {
            return (
                <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    {status}
                </div>
            )
        }
        if (s.includes("rejected")) {
            return (
                <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium border border-red-200">
                    <XCircle className="w-4 h-4 mr-1.5" />
                    {status}
                </div>
            )
        }
        return (
            <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200">
                <Clock className="w-4 h-4 mr-1.5" />
                {status}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {step === "input" && (
                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Check Application Status</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Enter your email address to view your loan application status.
                    </p>
                    <form onSubmit={form.handleSubmit(onCheckStatus)} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...form.register("email")}
                                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="john@example.com"
                            />
                            {form.formState.errors.email && (
                                <p className="mt-1 text-sm text-red-500">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Check Status
                        </Button>
                    </form>
                </Card>
            )}

            {step === "results" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Your Applications</h3>
                        <Button variant="outline" size="sm" onClick={() => {
                            setStep("input")
                            setApplications([])
                            form.reset()
                        }}>
                            Check Another
                        </Button>
                    </div>

                    {applications.length === 0 ? (
                        <Card className="p-8 text-center text-muted-foreground">
                            No applications found for this email address.
                        </Card>
                    ) : (
                        applications.map((app) => (
                            <Card key={app.id} className="p-6">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Application ID</p>
                                            <p className="font-medium">#{app.id}</p>
                                        </div>
                                        {getStatusBadge(app.status)}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Amount</p>
                                            <p className="font-medium">UGX {app.loan_amount?.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date Applied</p>
                                            <p className="font-medium">{new Date(app.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Purpose</p>
                                        <p className="font-medium truncate">{app.loan_purpose}</p>
                                    </div>

                                    {/* Disbursement Details */}
                                    {(app.status === "Approved" || app.status === "Disbursed" || app.status === "Disbursement In Progress") && (
                                        <div className="bg-neutral-50 p-4 rounded-lg space-y-3 border border-neutral-100">
                                            <h4 className="font-semibold text-sm flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-2 text-primary-500" />
                                                Disbursement Information
                                            </h4>

                                            {app.disbursement_date && (
                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {app.status === "Disbursed" ? "Disbursed On" : "Scheduled Disbursement"}
                                                    </p>
                                                    <p className="text-sm font-medium">
                                                        {new Date(app.disbursement_date).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}

                                            {app.payout_details && (
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Payout Account</p>
                                                    <p className="text-sm font-medium">
                                                        {app.payout_details.type === 'mobile_money' ? (
                                                            <>
                                                                Mobile Money: {app.payout_details.mobile_phone}
                                                                <br />
                                                                <span className="text-xs text-muted-foreground">({app.payout_details.account_name})</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {app.payout_details.bank_name} - {app.payout_details.account_number}
                                                                <br />
                                                                <span className="text-xs text-muted-foreground">({app.payout_details.account_name})</span>
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {error && (
                <Card className="p-4 bg-red-50 border-red-200 text-red-800 text-sm">
                    {error}
                </Card>
            )}
        </div>
    )
}
