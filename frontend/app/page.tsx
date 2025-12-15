"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, Shield, Zap, CheckCircle, DollarSign, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Container } from "@/components/layout/Container"

export default function HomePage() {
  const services = [
    {
      icon: DollarSign,
      title: "Quick Loans",
      description: "Fast approval and disbursement. Get funds in as little as 24 hours with competitive rates.",
      href: "/services/quick-loans",
    },
    {
      icon: TrendingUp,
      title: "Financial Planning",
      description: "Expert guidance to help you achieve your financial goals and secure your future.",
      href: "/services/finance",
    },
    {
      icon: Shield,
      title: "Legal Services",
      description: "Professional legal consultation and support for all your business needs.",
      href: "/services/legal",
    },
  ]

  const stats = [
    { label: "Loans Approved", value: "5,000+", icon: CheckCircle },
    { label: "Happy Clients", value: "3,500+", icon: Users },
    { label: "Average Processing", value: "24hrs", icon: Clock },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
  ]

  const features = [
    "No hidden fees",
    "Flexible repayment terms",
    "Quick approval process",
    "Competitive interest rates",
    "Dedicated support team",
    "Secure & confidential",
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
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Your Financial Success Starts Here
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8 text-balance">
                Fast, reliable financial services tailored to your needs. Get approved for loans up to UGX 1,000,000 with flexible terms and competitive rates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/apply">
                  <Button size="xl" variant="secondary" className="group">
                    Apply for Loan
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="xl" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <Container>
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
                <stat.icon className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-neutral-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive financial solutions designed to help you achieve your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                      <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                        <service.icon className="h-6 w-6 text-primary-500 group-hover:text-white transition-colors" />
                      </div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose Stronic Holdings?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We&apos;re committed to providing transparent, reliable, and customer-focused financial services.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Zap className="h-24 w-24 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">Fast & Reliable</h3>
                  <p className="text-muted-foreground">
                    Get your loan approved and disbursed within 24 hours
                  </p>
                </div>
              </div>
            </div>
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
              Apply for a loan today and experience fast, hassle-free financial services
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
