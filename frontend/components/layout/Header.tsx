"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Container } from "@/components/layout/Container"
import { cn } from "@/lib/utils"

export function Header() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navigation = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Services", href: "/services" },
        { name: "Contact", href: "/contact" },
    ]

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled
                    ? "bg-white/95 backdrop-blur-sm shadow-md"
                    : "bg-transparent"
            )}
        >
            <Container>
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-primary-500">
                                STRONIC
                            </span>
                            <span className="ml-2 text-sm font-medium text-muted-foreground">
                                HOLDINGS
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary-500"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/apply">
                            <Button variant="primary" size="md">
                                Apply Now
                            </Button>
                        </Link>
                        <Link href="/status">
                            <Button variant="outline" size="md">
                                Check Status
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 animate-fade-in">
                        <nav className="flex flex-col space-y-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium text-foreground/80 hover:text-primary-500"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="flex flex-col space-y-2 pt-4 border-t">
                                <Link href="/apply">
                                    <Button variant="primary" size="md" className="w-full">
                                        Apply Now
                                    </Button>
                                </Link>
                                <Link href="/status">
                                    <Button variant="outline" size="md" className="w-full">
                                        Check Status
                                    </Button>
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </Container>
        </header>
    )
}
