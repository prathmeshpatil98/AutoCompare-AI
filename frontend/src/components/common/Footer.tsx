import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/06 bg-black/20 py-12">
            <div className="container">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    className="h-6 w-6 fill-current text-primary"
                                >
                                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                </svg>
                            </div>
                            <span className="font-black text-lg gradient-text">AutoCompare AI</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            AI-powered car search engine that understands natural language.
                        </p>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Features</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/search?q=cars" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Search Cars
                                </Link>
                            </li>
                            <li>
                                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#platforms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Platforms
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Connect</h3>
                        <div className="flex gap-3">
                            <a
                                href="https://twitter.com"
                                aria-label="Follow us on Twitter"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/05 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a
                                href="https://github.com"
                                aria-label="Follow us on GitHub"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/05 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a
                                href="mailto:hello@autocompare-ai.com"
                                aria-label="Email us"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/05 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
                            >
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/06 py-8" />

                {/* Bottom footer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground text-center md:text-left">
                        © {currentYear} AutoCompare AI. All rights reserved. Built with{" "}
                        <span className="text-primary">♡</span> for car enthusiasts.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Powered by Groq · Elasticsearch · Redis · Next.js
                    </p>
                </div>
            </div>
        </footer>
    );
}
