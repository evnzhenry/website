"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { StatusCheckForm } from "@/components/forms/StatusCheckForm"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { HelpCircle, Mail, Phone } from "lucide-react"

export default function StatusPage() {
    const faqs = [
        {
            question: "Where can I find my reference number?",
            answer: "Your reference number was sent to your email immediately after submitting your application.",
        },
        {
            question: "How long does the review process take?",
            answer: "We typically review applications within 24 hours of submission.",
        },
        {
            question: "What if my application is rejected?",
            answer: "You&apos;ll receive an email with the reasons and can reapply after addressing the issues.",
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
                                Check Application Status
                            </h1>
                            <p className="text-lg md:text-xl text-primary-100 mb-8">
                                Track your loan application progress using your reference number
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

            {/* Status Check Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Status Check Form */}
                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Check Your Status</h2>
                            <p className="text-muted-foreground mb-8">
                                Enter your application reference number and email to view your loan application status.
                            </p>
                            <StatusCheckForm />
                        </motion.div>

                        {/* Help Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Card className="p-6 sticky top-24">
                                <div className="flex items-center mb-4">
                                    <HelpCircle className="h-6 w-6 text-primary-500 mr-2" />
                                    <h3 className="text-xl font-semibold">Need Help?</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6">
                                    If you&apos;re having trouble checking your status or have questions about your application, we&apos;re here to help.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <Mail className="h-5 w-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium">Email Us</p>
                                            <a href="mailto:support@stronicholdings.com" className="text-sm text-muted-foreground hover:text-primary-500 transition-colors">support@stronicholdings.com</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Phone className="h-5 w-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium">Call Us</p>
                                            <a href="tel:+256703676598" className="text-sm text-muted-foreground hover:text-primary-500 transition-colors">+256 703 676 598</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link href="/contact">
                                        <Button variant="outline" className="w-full">
                                            Contact Support
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </Container>
            </section>

            {/* FAQs Section */}
            <section className="py-20 bg-neutral-50">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Common questions about checking your application status
                        </p>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={faq.question}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                    </CardContent>
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
                            Haven&apos;t Applied Yet?
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Start your loan application today and get approved within 24 hours
                        </p>
                        <Link href="/apply">
                            <Button size="xl" variant="secondary">
                                Apply Now
                            </Button>
                        </Link>
                    </div>
                </Container>
            </section>
        </div>
    )
}
