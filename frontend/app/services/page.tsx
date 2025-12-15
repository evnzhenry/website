"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Container } from "@/components/layout/Container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { DollarSign, TrendingUp, Shield, Users, FileText, Scale, ArrowRight } from "lucide-react"

export default function ServicesPage() {
    const services = [
        {
            icon: DollarSign,
            title: "Quick Loans",
            description: "Fast approval and disbursement. Get funds in as little as 24 hours with competitive rates.",
            features: [
                "Loans up to UGX 1,000,000",
                "24-hour approval",
                "Flexible repayment terms",
                "No hidden fees",
            ],
            href: "/services/quick-loans",
        },
        {
            icon: TrendingUp,
            title: "Financial Planning",
            description: "Expert guidance to help you achieve your financial goals and secure your future.",
            features: [
                "Personalized financial strategies",
                "Investment advice",
                "Retirement planning",
                "Wealth management",
            ],
            href: "/services/finance",
        },
        {
            icon: Users,
            title: "Business Consultation",
            description: "Professional consultation services to help your business grow and thrive.",
            features: [
                "Business strategy development",
                "Financial analysis",
                "Market research",
                "Growth planning",
            ],
            href: "/services/consultation",
        },
        {
            icon: Scale,
            title: "Legal Services",
            description: "Professional legal consultation and support for all your business needs.",
            features: [
                "Contract review",
                "Legal compliance",
                "Business registration",
                "Dispute resolution",
            ],
            href: "/services/legal",
        },
    ]

    const benefits = [
        {
            icon: Shield,
            title: "Secure & Confidential",
            description: "Your information is protected with bank-level security",
        },
        {
            icon: Users,
            title: "Expert Support",
            description: "Dedicated team available to assist you every step",
        },
        {
            icon: FileText,
            title: "Simple Process",
            description: "Easy application with minimal documentation required",
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
                                Our Services
                            </h1>
                            <p className="text-lg md:text-xl text-primary-100 mb-8">
                                Comprehensive financial solutions designed to help you achieve your goals
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

            {/* Services Grid */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={service.href}>
                                    <Card hover className="h-full group cursor-pointer">
                                        <CardHeader>
                                            <div className="h-14 w-14 rounded-lg bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                                                <service.icon className="h-7 w-7 text-primary-500 group-hover:text-white transition-colors" />
                                            </div>
                                            <CardTitle className="text-2xl">{service.title}</CardTitle>
                                            <CardDescription className="text-base">
                                                {service.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 mb-6">
                                                {service.features.map((feature) => (
                                                    <li key={feature} className="flex items-start">
                                                        <ArrowRight className="h-4 w-4 text-primary-500 mr-2 mt-1 flex-shrink-0" />
                                                        <span className="text-sm text-muted-foreground">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="flex items-center text-primary-500 font-medium group-hover:translate-x-2 transition-transform">
                                                Learn more
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-neutral-50">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We&apos;re committed to providing the best service experience
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="text-center h-full">
                                    <CardHeader>
                                        <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mx-auto mb-4">
                                            <benefit.icon className="h-6 w-6 text-primary-500" />
                                        </div>
                                        <CardTitle className="text-xl">{benefit.title}</CardTitle>
                                        <CardDescription>{benefit.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Choose the service that&apos;s right for you and let us help you achieve your goals
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/apply">
                                <Button size="xl" variant="secondary">
                                    Apply Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="xl" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    )
}
