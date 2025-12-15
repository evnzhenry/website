"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Target, Users, Award, TrendingUp, Shield, Heart, ArrowRight } from "lucide-react"

export default function AboutPage() {
    const values = [
        {
            icon: Shield,
            title: "Trust & Transparency",
            description: "We believe in honest, transparent relationships with our clients. No hidden fees, no surprises.",
        },
        {
            icon: Heart,
            title: "Customer First",
            description: "Your financial success is our priority. We're committed to providing personalized service.",
        },
        {
            icon: Award,
            title: "Excellence",
            description: "We maintain the highest standards in all our services and continuously improve.",
        },
        {
            icon: TrendingUp,
            title: "Innovation",
            description: "We leverage technology to make financial services faster, easier, and more accessible.",
        },
    ]

    const stats = [
        { value: "5,000+", label: "Loans Approved" },
        { value: "3,500+", label: "Happy Clients" },
        { value: "98%", label: "Success Rate" },
        { value: "24hrs", label: "Avg Processing" },
    ]

    const team = [
        {
            name: "Sarah Nakato",
            role: "CEO & Founder",
            description: "15+ years in financial services",
        },
        {
            name: "David Okello",
            role: "Head of Operations",
            description: "Expert in loan processing",
        },
        {
            name: "Grace Nambi",
            role: "Legal Advisor",
            description: "Specialized in financial law",
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
                                About Stronic Holdings
                            </h1>
                            <p className="text-lg md:text-xl text-primary-100 mb-8">
                                Empowering individuals and businesses with accessible, reliable financial services since 2015.
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

            {/* Mission Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                At Stronic Holdings, we&apos;re on a mission to make financial services accessible to everyone.
                                We believe that everyone deserves access to fair, transparent, and efficient financial solutions.
                            </p>
                            <p className="text-lg text-muted-foreground mb-8">
                                Through innovative technology and personalized service, we&apos;re breaking down barriers and
                                helping individuals and businesses achieve their financial goals.
                            </p>
                            <Link href="/apply">
                                <Button size="lg" className="group">
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 p-8 flex items-center justify-center">
                                <div className="text-center">
                                    <Target className="h-24 w-24 text-primary-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Our Vision</h3>
                                    <p className="text-muted-foreground">
                                        To be Uganda&apos;s most trusted and innovative financial services provider
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-neutral-50">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Numbers that reflect our commitment to serving our community
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-primary-500 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full text-center">
                                    <CardHeader>
                                        <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mx-auto mb-4">
                                            <value.icon className="h-6 w-6 text-primary-500" />
                                        </div>
                                        <CardTitle className="text-xl">{value.title}</CardTitle>
                                        <CardDescription>{value.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-neutral-50">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Experienced professionals dedicated to your financial success
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="text-center">
                                    <CardHeader>
                                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mx-auto mb-4 flex items-center justify-center">
                                            <Users className="h-12 w-12 text-white" />
                                        </div>
                                        <CardTitle>{member.name}</CardTitle>
                                        <CardDescription className="text-primary-500 font-medium">
                                            {member.role}
                                        </CardDescription>
                                        <CardDescription>{member.description}</CardDescription>
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
                            Ready to Work With Us?
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Join thousands of satisfied clients who trust Stronic Holdings for their financial needs
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/apply">
                                <Button size="xl" variant="secondary">
                                    Apply for Loan
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
