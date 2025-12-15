"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Scale, FileText, Shield, Users, CheckCircle, Gavel, ArrowRight } from "lucide-react"

export default function LegalPage() {
    const services = [
        {
            icon: FileText,
            title: "Contract Review",
            description: "Thorough review and drafting of business contracts and agreements",
        },
        {
            icon: Gavel,
            title: "Legal Compliance",
            description: "Ensure your business complies with all relevant laws and regulations",
        },
        {
            icon: Users,
            title: "Business Registration",
            description: "Assistance with company registration and licensing procedures",
        },
        {
            icon: Shield,
            title: "Dispute Resolution",
            description: "Professional mediation and legal support for business disputes",
        },
    ]

    const legalAreas = [
        "Business Law",
        "Contract Law",
        "Employment Law",
        "Intellectual Property",
        "Tax Law",
        "Real Estate Law",
        "Corporate Governance",
        "Regulatory Compliance",
    ]

    const benefits = [
        "Experienced legal professionals",
        "Affordable legal services",
        "Quick turnaround times",
        "Confidential consultations",
        "Preventive legal advice",
        "Ongoing legal support",
    ]

    const process = [
        {
            step: "1",
            title: "Initial Consultation",
            description: "Discuss your legal needs and concerns with our team",
        },
        {
            step: "2",
            title: "Case Assessment",
            description: "We review your situation and provide legal options",
        },
        {
            step: "3",
            title: "Action Plan",
            description: "Develop a clear strategy to address your legal matters",
        },
        {
            step: "4",
            title: "Implementation",
            description: "Execute the plan with professional legal support",
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
                                Legal Services
                            </h1>
                            <p className="text-lg md:text-xl text-primary-100 mb-8">
                                Professional legal consultation and support for all your business needs. Protect your interests with expert legal guidance.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/contact">
                                    <Button size="xl" variant="secondary" className="group">
                                        Get Legal Advice
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link href="/services">
                                    <Button size="xl" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                                        View All Services
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

            {/* Services Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Legal Services</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive legal support for businesses and individuals
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full">
                                    <CardHeader>
                                        <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                                            <service.icon className="h-6 w-6 text-primary-500" />
                                        </div>
                                        <CardTitle className="text-xl">{service.title}</CardTitle>
                                        <CardDescription>{service.description}</CardDescription>
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            A structured approach to handling your legal matters
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

            {/* Legal Areas & Benefits */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Legal Areas */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Practice Areas</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        {legalAreas.map((area) => (
                                            <div key={area} className="flex items-start">
                                                <Scale className="h-4 w-4 text-primary-500 mr-2 mt-1 flex-shrink-0" />
                                                <span className="text-sm text-foreground">{area}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Why Choose Us</h2>
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
                            Need Legal Assistance?
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Contact our legal team today for professional advice and support
                        </p>
                        <Link href="/contact">
                            <Button size="xl" variant="secondary">
                                Schedule Consultation
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </Container>
            </section>
        </div>
    )
}
