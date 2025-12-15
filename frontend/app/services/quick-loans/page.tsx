"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { CheckCircle, Clock, DollarSign, Shield, TrendingUp, ArrowRight } from "lucide-react"

export default function QuickLoansPage() {
    const features = [
        {
            icon: Clock,
            title: "Fast Approval",
            description: "Get approved within 24 hours of application submission",
        },
        {
            icon: DollarSign,
            title: "Flexible Amounts",
            description: "Borrow from UGX 50,000 to UGX 1,000,000",
        },
        {
            icon: TrendingUp,
            title: "Competitive Rates",
            description: "Low interest rates starting from 2% per month",
        },
        {
            icon: Shield,
            title: "Secure Process",
            description: "Your information is protected with bank-level security",
        },
    ]

    const requirements = [
        "Must be 18 years or older",
        "Valid National ID or Passport",
        "Proof of income (payslip, bank statement)",
        "Active bank account",
        "Valid phone number and email",
    ]

    const benefits = [
        "No collateral required for loans under UGX 500,000",
        "Flexible repayment periods (3-24 months)",
        "No hidden fees or charges",
        "Quick disbursement within 24 hours",
        "Dedicated customer support",
        "Option to top up existing loans",
    ]

    const process = [
        {
            step: "1",
            title: "Apply Online",
            description: "Fill out our simple online application form with your details",
        },
        {
            step: "2",
            title: "Document Verification",
            description: "Submit required documents for quick verification",
        },
        {
            step: "3",
            title: "Approval",
            description: "Receive approval notification within 24 hours",
        },
        {
            step: "4",
            title: "Get Funds",
            description: "Money is transferred directly to your bank account",
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
                            className="max-w-3xl"
                        >
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Quick Loans
                            </h1>
                            <p className="text-lg md:text-xl text-primary-100 mb-8">
                                Fast, reliable loans when you need them most. Get up to UGX 1,000,000 with approval in just 24 hours.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/apply">
                                    <Button size="xl" variant="secondary" className="group">
                                        Apply Now
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="xl" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </Container>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Quick Loans?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We make borrowing simple, fast, and transparent
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="text-center h-full">
                                    <CardHeader>
                                        <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mx-auto mb-4">
                                            <feature.icon className="h-6 w-6 text-primary-500" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-neutral-50">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Get your loan in 4 simple steps
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {process.map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="text-center h-full">
                                    <CardHeader>
                                        <div className="h-14 w-14 rounded-full bg-primary-500 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                            {item.step}
                                        </div>
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Requirements & Benefits */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Requirements */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Requirements</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <ul className="space-y-3">
                                        {requirements.map((req) => (
                                            <li key={req} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-foreground">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Benefits</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <ul className="space-y-3">
                                        {benefits.map((benefit) => (
                                            <li key={benefit} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-foreground">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Apply?
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Start your application today and get the funds you need within 24 hours
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/apply">
                                <Button size="xl" variant="secondary">
                                    Apply for Loan
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/status">
                                <Button size="xl" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                                    Check Status
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    )
}
