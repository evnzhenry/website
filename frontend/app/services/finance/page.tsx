"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { TrendingUp, PiggyBank, Target, LineChart, Shield, ArrowRight } from "lucide-react"

export default function FinancePage() {
    const services = [
        {
            icon: Target,
            title: "Goal Planning",
            description: "Define and achieve your short-term and long-term financial goals with expert guidance",
        },
        {
            icon: PiggyBank,
            title: "Savings Strategy",
            description: "Develop effective savings plans to build wealth and secure your future",
        },
        {
            icon: LineChart,
            title: "Investment Advice",
            description: "Get professional advice on investment opportunities that match your risk profile",
        },
        {
            icon: Shield,
            title: "Risk Management",
            description: "Protect your assets with comprehensive risk assessment and mitigation strategies",
        },
    ]

    const benefits = [
        "Personalized financial strategies tailored to your needs",
        "Expert advisors with years of experience",
        "Regular portfolio reviews and adjustments",
        "Retirement planning and pension advice",
        "Tax optimization strategies",
        "Estate planning guidance",
    ]

    const process = [
        {
            step: "1",
            title: "Initial Consultation",
            description: "Meet with our financial advisor to discuss your goals and current situation",
        },
        {
            step: "2",
            title: "Financial Analysis",
            description: "We analyze your income, expenses, assets, and liabilities",
        },
        {
            step: "3",
            title: "Strategy Development",
            description: "Receive a customized financial plan tailored to your objectives",
        },
        {
            step: "4",
            title: "Implementation & Monitoring",
            description: "We help implement your plan and monitor progress regularly",
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
                                Financial Planning
                            </h1>
                            <p className="text-lg md:text-xl text-primary-100 mb-8">
                                Expert guidance to help you achieve your financial goals and secure your future with confidence.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/contact">
                                    <Button size="xl" variant="secondary" className="group">
                                        Schedule Consultation
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Financial Planning Services</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive solutions for all your financial planning needs
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
                            A structured approach to financial planning
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

            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Why Choose Our Financial Planning?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                We provide comprehensive financial planning services that help you make informed decisions about your money and future.
                            </p>
                            <ul className="space-y-3">
                                {benefits.map((benefit) => (
                                    <li key={benefit} className="flex items-start">
                                        <TrendingUp className="h-5 w-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 p-8 flex items-center justify-center">
                                <div className="text-center">
                                    <LineChart className="h-24 w-24 text-primary-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Expert Guidance</h3>
                                    <p className="text-muted-foreground">
                                        Professional advisors to help you navigate your financial journey
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Start Planning Your Financial Future
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Schedule a consultation with our expert financial advisors today
                        </p>
                        <Link href="/contact">
                            <Button size="xl" variant="secondary">
                                Book Consultation
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </Container>
            </section>
        </div>
    )
}
