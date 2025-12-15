"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/Card"

export default function TermsPage() {
    const sections = [
        {
            title: "Acceptance of Terms",
            content: [
                "By accessing and using Stronic Holdings services, you accept and agree to be bound by these Terms and Conditions",
                "If you do not agree to these terms, please do not use our services",
                "We reserve the right to modify these terms at any time",
                "Continued use of our services after changes constitutes acceptance of the new terms",
            ],
        },
        {
            title: "Loan Services",
            content: [
                "Loan approval is subject to our credit assessment and verification process",
                "We reserve the right to approve or reject any loan application",
                "Loan amounts, interest rates, and repayment terms are determined on a case-by-case basis",
                "All loans are subject to Ugandan financial regulations",
                "Borrowers must meet minimum eligibility requirements",
            ],
        },
        {
            title: "Borrower Obligations",
            content: [
                "Provide accurate and complete information in your application",
                "Maintain valid contact information",
                "Make timely repayments according to the agreed schedule",
                "Notify us immediately of any changes in your financial situation",
                "Use loan funds only for the stated purpose",
                "Comply with all applicable laws and regulations",
            ],
        },
        {
            title: "Interest Rates and Fees",
            content: [
                "Interest rates are clearly stated in your loan agreement",
                "All fees and charges will be disclosed before you accept the loan",
                "There are no hidden fees or charges",
                "Late payment fees may apply for overdue payments",
                "Early repayment may be allowed without penalty (subject to agreement)",
            ],
        },
        {
            title: "Repayment Terms",
            content: [
                "Repayment schedules are agreed upon before loan disbursement",
                "Payments must be made on or before the due date",
                "Late payments may incur additional fees and affect your credit score",
                "We may report payment history to credit bureaus",
                "Failure to repay may result in legal action",
            ],
        },
        {
            title: "Default and Collections",
            content: [
                "Default occurs when payments are not made according to the agreed schedule",
                "We will attempt to contact you before taking collection action",
                "We may engage third-party collection agencies",
                "Legal action may be taken to recover outstanding amounts",
                "You are responsible for all collection costs and legal fees",
            ],
        },
        {
            title: "Confidentiality",
            content: [
                "We maintain the confidentiality of your personal and financial information",
                "Information may be shared with credit bureaus and regulatory authorities",
                "We comply with data protection laws and regulations",
                "See our Privacy Policy for detailed information on data handling",
            ],
        },
        {
            title: "Limitation of Liability",
            content: [
                "We are not liable for any indirect or consequential damages",
                "Our liability is limited to the amount of the loan in question",
                "We are not responsible for delays caused by circumstances beyond our control",
                "We do not guarantee loan approval or specific terms",
            ],
        },
        {
            title: "Intellectual Property",
            content: [
                "All content on our website is protected by copyright and trademark laws",
                "You may not reproduce, distribute, or modify our content without permission",
                "The Stronic Holdings name and logo are registered trademarks",
            ],
        },
        {
            title: "Dispute Resolution",
            content: [
                "Any disputes will be resolved through negotiation and mediation first",
                "If mediation fails, disputes will be resolved through arbitration",
                "Arbitration will be conducted in accordance with Ugandan law",
                "Legal proceedings will be conducted in Ugandan courts",
            ],
        },
        {
            title: "Termination",
            content: [
                "We may terminate or suspend services at any time for violation of these terms",
                "You may close your account at any time after settling all outstanding obligations",
                "Termination does not affect existing loan agreements",
                "All outstanding amounts remain due upon termination",
            ],
        },
        {
            title: "Governing Law",
            content: [
                "These terms are governed by the laws of Uganda",
                "We comply with all applicable financial regulations",
                "Any legal proceedings will be subject to Ugandan jurisdiction",
            ],
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
                                Terms & Conditions
                            </h1>
                            <p className="text-lg md:text-xl text-primary-100 mb-4">
                                Last updated: November 27, 2025
                            </p>
                            <p className="text-lg text-primary-100">
                                Please read these terms carefully before using our services.
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

            {/* Content Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="max-w-4xl mx-auto space-y-8">
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                                        {section.title}
                                    </h2>
                                    <ul className="space-y-2">
                                        {section.content.map((item, i) => (
                                            <li key={i} className="flex items-start">
                                                <span className="text-primary-500 mr-2">•</span>
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        ))}

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Card className="p-6 bg-primary-50 border-primary-200">
                                <h2 className="text-2xl font-bold mb-4 text-foreground">
                                    Questions About These Terms?
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about these Terms and Conditions, please contact us:
                                </p>
                                <div className="space-y-2 text-foreground">
                                    <p><strong>Email:</strong> <a href="mailto:legal@stronicholdings.com" className="text-primary-600 hover:underline">legal@stronicholdings.com</a></p>
                                    <p><strong>Phone:</strong> <a href="tel:+256703676598" className="text-primary-600 hover:underline">+256 703 676 598</a></p>
                                    <p><strong>Address:</strong> Devon Avenue, Kyambogo, Kampala</p>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </Container>
            </section>
        </div>
    )
}
