"use client";

import Link from "next/link";
import { AlertTriangle, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-[15%] left-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/08 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-purple-600/08 blur-[100px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg">
                {/* Icon */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-10 w-10 text-destructive" />
                </div>

                {/* Error Code */}
                <div>
                    <h1 className="text-6xl sm:text-7xl font-black gradient-text mb-2">404</h1>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Page Not Found</h2>
                    <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-sm">
                        The page you're looking for doesn't exist. It might have been moved or deleted.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Link>
                    <Link
                        href="/search?q=best+cars"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/05 border border-white/10 px-6 py-3 text-sm font-semibold text-foreground hover:bg-white/10 transition-all"
                    >
                        <Search className="h-4 w-4" />
                        Search Cars
                    </Link>
                </div>

                {/* Helpful text */}
                <p className="text-xs text-muted-foreground mt-8">
                    Need help? <a href="mailto:support@autocompare-ai.com" className="text-primary hover:underline">Contact support</a>
                </p>
            </div>
        </div>
    );
}
