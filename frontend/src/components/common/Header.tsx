"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/06 glass">
                <div className="container flex h-16 items-center justify-between">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-all duration-300 overflow-hidden">
                            <svg
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                className="h-6 w-6 fill-current text-primary transition-transform duration-300 group-hover:scale-110"
                            >
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                            </svg>
                        </div>
                        <div className="flex items-baseline gap-0.5 hidden sm:flex">
                            <span className="font-black text-xl gradient-text">AutoCompare</span>
                            <span className="font-black text-xl text-primary/80"> AI</span>
                        </div>
                        <span className="font-black text-lg gradient-text sm:hidden">AC AI</span>
                    </a>

                    {/* Desktop Nav links */}
                    <nav className="hidden md:flex items-center gap-1">
                        <a
                            href="/"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/05 transition-all"
                            aria-label="Home page"
                        >
                            Home
                        </a>
                        <a
                            href="/search?q=top+cars+under+8+lakh"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/05 transition-all"
                            aria-label="Browse all cars"
                        >
                            Browse
                        </a>
                    </nav>

                    {/* Desktop CTA */}
                    <a
                        href="/search?q=best+cars+under+8+lakh"
                        className="hidden md:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
                        aria-label="Start searching for cars"
                    >
                        Start Searching →
                    </a>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/08 transition-colors text-muted-foreground hover:text-foreground"
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div
                        id="mobile-menu"
                        className="border-t border-white/06 bg-black/40 backdrop-blur-sm md:hidden"
                        role="navigation"
                        aria-label="Mobile navigation"
                    >
                        <div className="container flex flex-col divide-y divide-white/06">
                            <a
                                href="/"
                                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/05 transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </a>
                            <a
                                href="/search?q=top+cars+under+8+lakh"
                                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/05 transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Browse
                            </a>
                            <a
                                href="/search?q=best+cars+under+8+lakh"
                                className="px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Start Searching →
                            </a>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
