import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { Facebook, Mail, Phone, MapPin, Youtube } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-neutral-900 text-neutral-100">
            <Container>
                <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">
                            STRONIC HOLDINGS
                        </h3>
                        <p className="text-sm text-neutral-400 mb-4">
                            Your trusted partner for financial services, quick loans, and professional consultation.
                        </p>
                        <div className="flex space-x-4">
                            {/* Facebook */}
                            <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors" aria-label="Facebook">
                                <Facebook className="h-5 w-5" />
                            </a>

                            {/* X (Twitter) */}
                            <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors" aria-label="X (Twitter)">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            {/* TikTok */}
                            <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors" aria-label="TikTok">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>

                            {/* YouTube */}
                            <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors" aria-label="YouTube">
                                <Youtube className="h-5 w-5" />
                            </a>

                            {/* WhatsApp */}
                            <a href="https://wa.me/256703676598" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-500 transition-colors" aria-label="WhatsApp">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                    Our Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/apply" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                    Apply for Loan
                                </Link>
                            </li>
                            <li>
                                <Link href="/status" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                    Check Status
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/services/quick-loans" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                    Quick Loans
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/finance" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                    Financial Planning
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/consultation" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                    Consultation
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/legal" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                    Legal Services
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                                <a
                                    href="https://maps.google.com/?q=Devon+Avenue,+Kyambogo,+Kampala"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-neutral-400 hover:text-primary-500 transition-colors"
                                >
                                    Devon Avenue, Kyambogo, Kampala
                                </a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-primary-500 flex-shrink-0" />
                                <a
                                    href="tel:+256703676598"
                                    className="text-sm text-neutral-400 hover:text-primary-500 transition-colors"
                                >
                                    +256 703 676 598
                                </a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-primary-500 flex-shrink-0" />
                                <span className="text-sm text-neutral-400">
                                    <a href="mailto:info@stronicholdings.com" className="hover:text-primary-500 transition-colors">
                                        info@stronicholdings.com
                                    </a>
                                    <br />
                                    <a href="mailto:support@stronicholdings.com" className="hover:text-primary-500 transition-colors">
                                        support@stronicholdings.com
                                    </a>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-neutral-800 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-neutral-400">
                            © {currentYear} Stronic Holdings. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <Link href="/privacy" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                Terms & Conditions
                            </Link>
                            <Link href="/admin/login" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                Staff Login
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    )
}
