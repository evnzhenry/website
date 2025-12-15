"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { apiClient } from "@/lib/api-client"
import { AdminDashboardStats } from "@/types/api"
import {
    Users,
    FileText,
    CheckCircle,
    XCircle,
    DollarSign,
    ArrowUpRight
} from "lucide-react"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminDashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await apiClient.getAdminStats()
                setStats(data)
            } catch (error) {
                console.error("Failed to load stats:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadStats()
    }, [])

    if (isLoading) {
        return <div className="p-8 text-center">Loading dashboard...</div>
    }

    if (!stats) {
        return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>
    }

    const statCards = [
        {
            title: "Total Applications",
            value: stats.totalApplications,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "Pending Review",
            value: stats.pendingApplications,
            icon: Users,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
        },
        {
            title: "Approved",
            value: stats.approvedApplications,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            title: "Rejected",
            value: stats.rejectedApplications,
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50",
        },
    ]

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Total Disbursed */}
            <Card className="p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-primary-100 font-medium">Total Disbursed Amount</p>
                        <h2 className="text-4xl font-bold mt-2">
                            UGX {stats.totalDisbursed.toLocaleString()}
                        </h2>
                    </div>
                    <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                        <DollarSign className="h-8 w-8 text-white" />
                    </div>
                </div>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Recent Applications</h3>
                        <button className="text-sm text-primary-600 hover:underline flex items-center">
                            View All <ArrowUpRight className="ml-1 h-4 w-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 text-center py-8">
                            No recent applications to display.
                        </p>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Recent Contacts</h3>
                        <button className="text-sm text-primary-600 hover:underline flex items-center">
                            View All <ArrowUpRight className="ml-1 h-4 w-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 text-center py-8">
                            No recent messages to display.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
