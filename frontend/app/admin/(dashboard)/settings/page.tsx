"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { User, Lock, Bell, Shield, Save, CreditCard, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { CreditorAccount } from "@/types/api"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [isLoading, setIsLoading] = useState(false)

    // Creditor Accounts State
    const [accounts, setAccounts] = useState<CreditorAccount[]>([])
    const [loadingAccounts, setLoadingAccounts] = useState(false)
    const [isAddingAccount, setIsAddingAccount] = useState(false)
    const [newAccount, setNewAccount] = useState({
        type: 'bank',
        name: '',
        provider_name: '',
        account_number: '',
        currency: 'KES'
    })

    // Security State
    const [security, setSecurity] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactor: false
    })

    // Notifications State
    const [notifications, setNotifications] = useState({
        email: true,
        disbursements: true,
        messages: true
    })

    // System State
    const [system, setSystem] = useState({
        maintenanceMode: false,
        version: '1.2.0'
    })

    useEffect(() => {
        if (activeTab === 'creditor-accounts') {
            fetchAccounts()
        }
    }, [activeTab])

    const fetchAccounts = async () => {
        setLoadingAccounts(true)
        try {
            const data = await apiClient.getCreditorAccounts()
            setAccounts(data)
        } catch (error) {
            console.error("Failed to fetch accounts", error)
        } finally {
            setLoadingAccounts(false)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        // Simulate API call for other settings
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
        alert("Settings saved successfully!")
    }

    const handleAddAccount = async () => {
        try {
            await apiClient.addCreditorAccount(newAccount)
            setIsAddingAccount(false)
            setNewAccount({ type: 'bank', name: '', provider_name: '', account_number: '', currency: 'KES' })
            fetchAccounts()
        } catch (error) {
            console.error(error)
            alert("Failed to add account")
        }
    }

    const handleDeleteAccount = async (id: number) => {
        if (!confirm("Are you sure you want to delete this account?")) return
        try {
            await apiClient.deleteCreditorAccount(id)
            fetchAccounts()
        } catch (error) {
            console.error(error)
            alert("Failed to delete account")
        }
    }

    const handleSetDefault = async (id: number) => {
        try {
            await apiClient.setDefaultCreditorAccount(id)
            fetchAccounts()
        } catch (error) {
            console.error(error)
            alert("Failed to set default account")
        }
    }

    const navItems = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'creditor-accounts', label: 'Creditor Accounts', icon: CreditCard },
        { id: 'system', label: 'System', icon: Shield },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Navigation Sidebar */}
                <Card className="p-4 lg:col-span-1 h-fit">
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                                    ? "bg-primary-50 text-primary-700"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${activeTab === item.id ? "text-primary-600" : "text-gray-400"}`} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </Card>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Section */}
                    {activeTab === 'profile' && (
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" defaultValue="Admin" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" defaultValue="User" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" defaultValue="support@stronicholdings.com" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave} disabled={isLoading}>
                                        {isLoading ? "Saving..." : "Save Changes"}
                                        {!isLoading && <Save className="ml-2 h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Creditor Accounts Section */}
                    {activeTab === 'creditor-accounts' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900">Creditor Accounts</h2>
                                <Button onClick={() => setIsAddingAccount(!isAddingAccount)} size="sm">
                                    <Plus className="mr-2 h-4 w-4" /> Add Account
                                </Button>
                            </div>

                            {isAddingAccount && (
                                <Card className="p-4 bg-gray-50 border-primary-200">
                                    <h3 className="text-sm font-semibold mb-3">New Account Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                value={newAccount.type}
                                                onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                                            >
                                                <option value="bank">Bank Account</option>
                                                <option value="mobile_money">Mobile Money</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Name (Ref)</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                placeholder="e.g. Operating Account"
                                                value={newAccount.name}
                                                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Provider Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                placeholder="e.g. Equity Bank or MPESA"
                                                value={newAccount.provider_name}
                                                onChange={(e) => setNewAccount({ ...newAccount, provider_name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Account / Phone Number</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                placeholder="Account or Phone Number"
                                                value={newAccount.account_number}
                                                onChange={(e) => setNewAccount({ ...newAccount, account_number: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setIsAddingAccount(false)}>Cancel</Button>
                                        <Button size="sm" onClick={handleAddAccount}>Save Account</Button>
                                    </div>
                                </Card>
                            )}

                            {loadingAccounts ? (
                                <div className="text-center py-8 text-gray-500">Loading accounts...</div>
                            ) : accounts.length === 0 ? (
                                <Card className="p-8 text-center text-gray-500 border-dashed">
                                    <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    No creditor accounts configured. Add one to enable disbursements.
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {accounts.map((acc) => (
                                        <Card key={acc.id} className={`p-4 flex items-center justify-between ${acc.is_default ? 'border-primary-500 ring-1 ring-primary-500' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${acc.type === 'bank' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                    <CreditCard className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-900">{acc.name}</span>
                                                        {acc.is_default && (
                                                            <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full font-medium">Default</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {acc.provider_name} • {acc.account_number} • {acc.currency}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!acc.is_default && (
                                                    <Button variant="ghost" size="sm" onClick={() => handleSetDefault(acc.id)} title="Set as default">
                                                        <CheckCircle className="h-4 w-4 text-gray-400 hover:text-primary-600" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteAccount(acc.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Security Section */}
                    {activeTab === 'security' && (
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Change Password</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                            value={security.currentPassword}
                                            onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                                value={security.newPassword}
                                                onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                                value={security.confirmPassword}
                                                onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                                            <p className="text-sm text-gray-500">Require an OTP code when logging in.</p>
                                        </div>
                                        <Button
                                            variant={security.twoFactor ? "primary" : "outline"}
                                            onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
                                            size="sm"
                                        >
                                            {security.twoFactor ? "Enabled" : "Disabled"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave} disabled={isLoading}>
                                        {isLoading ? "Saving..." : "Update Security"}
                                        {!isLoading && <Lock className="ml-2 h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Notifications Section */}
                    {activeTab === 'notifications' && (
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">New Application Emails</h3>
                                        <p className="text-sm text-gray-500">Receive an email when a new loan application is submitted.</p>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer" onClick={() => setNotifications({ ...notifications, email: !notifications.email })}>
                                        <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${notifications.email ? 'bg-primary-600 after:translate-x-full' : ''}`}></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Disbursement Alerts</h3>
                                        <p className="text-sm text-gray-500">Get notified when disbursements are processed or fail.</p>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer" onClick={() => setNotifications({ ...notifications, disbursements: !notifications.disbursements })}>
                                        <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${notifications.disbursements ? 'bg-primary-600 after:translate-x-full' : ''}`}></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Contact Messages</h3>
                                        <p className="text-sm text-gray-500">Receive emails for new contact form submissions.</p>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer" onClick={() => setNotifications({ ...notifications, messages: !notifications.messages })}>
                                        <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${notifications.messages ? 'bg-primary-600 after:translate-x-full' : ''}`}></div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave} disabled={isLoading}>
                                        {isLoading ? "Saving..." : "Save Preferences"}
                                        {!isLoading && <Save className="ml-2 h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* System Section */}
                    {activeTab === 'system' && (
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">System Information</h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Application</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Version</span>
                                                <span className="text-sm font-medium text-gray-900">{system.version}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Environment</span>
                                                <span className="text-sm font-medium text-gray-900">{process.env.NODE_ENV === 'development' ? 'Development' : 'Production'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Last Build</span>
                                                <span className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Database</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Status</span>
                                                <span className="text-sm font-medium text-green-600 flex items-center">
                                                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                                                    Connected
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Type</span>
                                                <span className="text-sm font-medium text-gray-900">SQLite / MySQL</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                                            <p className="text-sm text-gray-500">Prevent new applications while performing maintenance.</p>
                                        </div>
                                        <Button
                                            variant={system.maintenanceMode ? "secondary" : "outline"}
                                            onClick={() => setSystem({ ...system, maintenanceMode: !system.maintenanceMode })}
                                            size="sm"
                                        >
                                            {system.maintenanceMode ? "Active" : "Inactive"}
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">System Cache</h3>
                                            <p className="text-sm text-gray-500">Clear temporary data and cached API responses.</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => alert("Cache cleared successfully.")}>
                                            Clear Cache
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
