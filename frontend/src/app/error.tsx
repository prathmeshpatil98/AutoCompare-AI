"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-[15%] left-[10%] h-[500px] w-[500px] rounded-full bg-red-600/08 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-orange-600/08 blur-[100px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg">
                {/* Icon */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                </div>

                {/* Error message */}
                <div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">Something went wrong</h1>
                    <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                        We encountered an unexpected error. Please try again or contact support if the problem persists.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground/60 mt-4 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/05 border border-white/10 px-6 py-3 text-sm font-semibold text-foreground hover:bg-white/10 transition-all"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Link>
                </div>

                {/* Support text */}
                <p className="text-xs text-muted-foreground mt-8">
                    Persistent issues? <a href="mailto:support@autocompare-ai.com" className="text-primary hover:underline">Contact support</a>
                </p>
            </div>
        </div>
    );
}
