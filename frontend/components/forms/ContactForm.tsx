"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    })

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)
        try {
            await apiClient.submitContact(data)
            setSubmitSuccess(true)
            reset()
            setTimeout(() => setSubmitSuccess(false), 5000)
        } catch (error) {
            console.error("Submission error:", error)
            const errorMessage = error instanceof Error ? error.message : "Failed to send message"
            alert(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register("name")}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="John Doe"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="john@example.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="+256 XXX XXX XXX"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Subject *
                    </label>
                    <input
                        id="subject"
                        type="text"
                        {...register("subject")}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="How can we help you?"
                    />
                    {errors.subject && (
                        <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message *
                    </label>
                    <textarea
                        id="message"
                        {...register("message")}
                        rows={5}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                        <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                    )}
                </div>

                {submitSuccess && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                            Thank you for your message! We&apos;ll get back to you soon.
                        </p>
                    </div>
                )}

                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        "Send Message"
                    )}
                </Button>
            </form>
        </Card>
    )
}
