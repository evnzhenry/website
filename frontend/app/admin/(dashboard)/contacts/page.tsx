"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { apiClient } from "@/lib/api-client"
import { Loader2, Search } from "lucide-react"
import { ContactMessage } from "@/types/api"

export default function ContactsPage() {
    const [contacts, setContacts] = useState<ContactMessage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        const loadContacts = async () => {
            setIsLoading(true)
            try {
                const data = await apiClient.getContacts(filter === "all" ? undefined : filter)
                setContacts(data)
            } catch (error) {
                console.error("Failed to load contacts:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadContacts()
    }, [filter])

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
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
                        <option value="all">All Messages</option>
                        <option value="unseen">Unread</option>
                        <option value="seen">Read</option>
                    </select>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Subject</th>
                                <th className="px-6 py-3">Message</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary-500" />
                                    </td>
                                </tr>
                            ) : contacts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No messages found.
                                    </td>
                                </tr>
                            ) : (
                                contacts.map((contact) => (
                                    <tr key={contact.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(contact.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{contact.name}</div>
                                            <div className="text-xs text-gray-500">{contact.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {contact.subject}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                                            {contact.message}
                                        </td>
                                        <td className="px-6 py-4">
                                            {contact.seen ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    Read
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    New
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
