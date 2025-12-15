"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/layout/Container"
import { ContactForm } from "@/components/forms/ContactForm"
import { Card, CardHeader, CardTitle } from "@/components/ui/Card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
    const contactInfo = [
        {
            icon: MapPin,
            title: "Our Location",
            details: [
                <a key="address" href="https://maps.google.com/?q=Devon+Avenue,+Kyambogo,+Kampala" target="_blank" rel="noopener noreferrer" className="hover:text-primary-500 transition-colors">Devon Avenue, Kyambogo</a>,
                "Kampala, Uganda"
            ],
        },
        {
            icon: Phone,
            title: "Phone",
            details: [
                <a key="phone" href="tel:+256703676598" className="hover:text-primary-500 transition-colors">+256 703 676 598</a>
            ],
        },
        {
            icon: Mail,
            title: "Email",
            details: [
                <a key="email1" href="mailto:info@stronicholdings.com" className="hover:text-primary-500 transition-colors">info@stronicholdings.com</a>,
                <a key="email2" href="mailto:support@stronicholdings.com" className="hover:text-primary-500 transition-colors">support@stronicholdings.com</a>
            ],
        },
        {
            icon: Clock,
            title: "Business Hours",
            details: ["Mon - Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 2:00 PM"],
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
                                Get In Touch
                            </h1>
                            <p className="text-lg md:text-xl text-primary-100 mb-8">
                                Have questions? We&apos;re here to help. Reach out to us and we&apos;ll respond as soon as possible.
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

            {/* Contact Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                            <p className="text-muted-foreground mb-8">
                                Fill out the form below and we&apos;ll get back to you within 24 hours.
                            </p>
                            <ContactForm />
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                            <p className="text-muted-foreground mb-8">
                                You can also reach us through any of the following channels:
                            </p>
                            <div className="space-y-6">
                                {contactInfo.map((info, index) => (
                                    <motion.div
                                        key={info.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card>
                                            <CardHeader>
                                                <div className="flex items-start space-x-4">
                                                    <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                                                        <info.icon className="h-6 w-6 text-primary-500" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg mb-2">{info.title}</CardTitle>
                                                        {info.details.map((detail, i) => (
                                                            <p key={i} className="text-sm text-muted-foreground">
                                                                {detail}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </Container>
            </section>

            {/* Map Section (Placeholder) */}
            <section className="py-20 bg-neutral-50">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">Find Us</h2>
                        <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                            <iframe
                                width="100%"
                                height="100%"
                                id="gmap_canvas"
                                src="https://maps.google.com/maps?q=Devon%20Avenue%2C%20Kyambogo%2C%20Kampala&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight={0}
                                marginWidth={0}
                                title="Stronic Holdings Location"
                            ></iframe>
                        </div>
                    </motion.div>
                </Container>
            </section>
        </div>
    )
}
