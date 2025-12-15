"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { apiClient } from "@/lib/api-client"
import { LoanApplication } from "@/types/api"
import { Eye, Loader2, Search, Filter } from "lucide-react"

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<LoanApplication[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        const loadApplications = async () => {
            setIsLoading(true)
            try {
                // In a real app, we'd pass the filter to the API
                const data = await apiClient.getApplications(filter === "all" ? undefined : filter)
                setApplications(data)
            } catch (error) {
                console.error("Failed to load applications:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadApplications()
    }, [filter])

    const getStatusBadge = (status?: string) => {
        const s = status?.toLowerCase() || "pending"
        let color = "bg-gray-100 text-gray-800"

        if (s.includes("approv")) color = "bg-green-100 text-green-800"
        else if (s.includes("reject")) color = "bg-red-100 text-red-800"
        else if (s.includes("pending")) color = "bg-yellow-100 text-yellow-800"
        else if (s.includes("disburs")) color = "bg-blue-100 text-blue-800"

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                {status || "Pending"}
            </span>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="disbursed">Disbursed</option>
                    </select>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Applicant</th>
                                <th className="px-6 py-3">Amount (UGX)</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary-500" />
                                    </td>
                                </tr>
                            ) : applications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No applications found.
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{app.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{app.full_name}</div>
                                            <div className="text-xs text-gray-500">{app.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {app.loan_amount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(app.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/applications/view?id=${app.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing {applications.length} results</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
