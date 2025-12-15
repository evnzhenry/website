"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/layout/Container"
import { Card } from "@/components/ui/Card"

export default function PrivacyPage() {
    const sections = [
        {
            title: "Information We Collect",
            content: [
                "Personal identification information (Name, email address, phone number, etc.)",
                "Financial information necessary for loan processing",
                "Employment and income information",
                "National ID or passport information",
                "Bank account details",
                "Usage data and cookies when you visit our website",
            ],
        },
        {
            title: "How We Use Your Information",
            content: [
                "To process your loan applications and provide our services",
                "To verify your identity and prevent fraud",
                "To communicate with you about your applications and services",
                "To improve our services and customer experience",
                "To comply with legal and regulatory requirements",
                "To send you important updates and notifications",
            ],
        },
        {
            title: "Information Sharing",
            content: [
                "We do not sell or rent your personal information to third parties",
                "We may share information with credit bureaus for verification purposes",
                "We may share information with regulatory authorities when required by law",
                "We may share information with service providers who assist in our operations",
                "All third parties are bound by confidentiality agreements",
            ],
        },
        {
            title: "Data Security",
            content: [
                "We use industry-standard encryption to protect your data",
                "Access to personal information is restricted to authorized personnel only",
                "We regularly update our security measures and conduct audits",
                "We maintain secure servers and backup systems",
                "We have incident response procedures in place",
            ],
        },
        {
            title: "Your Rights",
            content: [
                "Right to access your personal information",
                "Right to correct inaccurate information",
                "Right to request deletion of your data (subject to legal requirements)",
                "Right to object to processing of your data",
                "Right to data portability",
                "Right to withdraw consent at any time",
            ],
        },
        {
            title: "Cookies and Tracking",
            content: [
                "We use cookies to improve your browsing experience",
                "Cookies help us understand how you use our website",
                "You can disable cookies in your browser settings",
                "Some features may not work properly without cookies",
                "We do not use cookies for advertising purposes",
            ],
        },
        {
            title: "Data Retention",
            content: [
                "We retain your information for as long as necessary to provide our services",
                "We comply with legal requirements for data retention",
                "Inactive accounts may be archived after a certain period",
                "You can request deletion of your data subject to legal obligations",
            ],
        },
        {
            title: "Changes to This Policy",
            content: [
                "We may update this privacy policy from time to time",
                "We will notify you of significant changes via email or website notice",
                "Continued use of our services constitutes acceptance of changes",
                "The latest version will always be available on our website",
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
                                Privacy Policy
                            </h1>
                            <p className="text-lg md:text-xl text-primary-100 mb-4">
                                Last updated: November 27, 2025
                            </p>
                            <p className="text-lg text-primary-100">
                                Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
                                    Contact Us
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions about this Privacy Policy or how we handle your data, please contact us:
                                </p>
                                <div className="space-y-2 text-foreground">
                                    <p><strong>Email:</strong> <a href="mailto:privacy@stronicholdings.com" className="text-primary-600 hover:underline">privacy@stronicholdings.com</a></p>
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
