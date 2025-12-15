"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/layout/Container"
import { LoanApplicationForm } from "@/components/forms/LoanApplicationForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { CheckCircle, Clock, Shield, FileText } from "lucide-react"

export default function ApplyPage() {
    const requirements = [
        "Valid National ID",
        "Proof of income",
        "Bank account details",
        "Contact information",
    ]

    const process = [
        {
            icon: FileText,
            title: "Fill Application",
            description: "Complete the online application form with your details",
        },
        {
            icon: Clock,
            title: "Quick Review",
            description: "Our team reviews your application within 24 hours",
        },
        {
            icon: CheckCircle,
            title: "Get Approved",
            description: "Receive approval notification via email and SMS",
        },
        {
            icon: Shield,
            title: "Receive Funds",
            description: "Funds are disbursed directly to your bank account",
        },
    ]

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <Container className="relative">
                    <div className="py-20 md:py-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Apply for a Loan
                            </h1>
                            <p className="text-lg md:text-xl text-primary-100 mb-8">
                                Get up to UGX 1,000,000 with flexible repayment terms. Fast approval in 24 hours.
                            </p>
                        </motion.div>
                    </div>
                </Container>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Application Process */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our simple 4-step process gets you the funds you need quickly
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                        {process.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="text-center h-full">
                                    <CardHeader>
                                        <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                                            <step.icon className="h-7 w-7 text-primary-500" />
                                        </div>
                                        <CardTitle className="text-lg">{step.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-2">{step.description}</p>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Application Form Section */}
            <section className="py-20 bg-neutral-50">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Card className="p-6 sticky top-24">
                                <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                                <ul className="space-y-3">
                                    {requirements.map((req) => (
                                        <li key={req} className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-foreground">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                                    <p className="text-sm text-primary-700">
                                        <strong>Note:</strong> All information provided will be kept confidential and secure.
                                    </p>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Application Form */}
                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Application Form</h2>
                            <LoanApplicationForm />
                        </motion.div>
                    </div>
                </Container>
            </section>
        </div>
    )
}
