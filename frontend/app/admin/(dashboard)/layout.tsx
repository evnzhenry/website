"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { apiClient } from "@/lib/api-client"

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 0)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        // Check auth
        const token = apiClient.getToken()
        if (!token && typeof window !== 'undefined') {
            // Double check local storage directly in case apiClient isn't sync'd yet
            if (!localStorage.getItem('adminToken')) {
                router.push("/admin/login")
            }
        }
    }, [router])

    if (!isMounted) return null

    const navigation = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Applications", href: "/admin/applications", icon: FileText },
        { name: "Contacts", href: "/admin/contacts", icon: Users },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ]

    const handleLogout = () => {
        apiClient.setToken(null)
        router.push("/admin/login")
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <span className="text-xl font-bold text-primary-600">Stronic Admin</span>
                        <button
                            className="lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                        ${isActive
                                            ? "bg-primary-50 text-primary-700"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}
                                    `}
                                >
                                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary-600" : "text-gray-400"}`} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-4 border-t">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <header className="sticky top-0 z-30 flex items-center h-16 bg-white shadow-sm px-4 lg:px-8">
                    <button
                        className="lg:hidden mr-4"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6 text-gray-500" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-gray-900">
                            {navigation.find(item => item.href === pathname)?.name || "Dashboard"}
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                            A
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
