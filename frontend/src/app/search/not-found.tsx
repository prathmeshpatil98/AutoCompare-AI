"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="sticky top-16 z-30 border-b border-white/06 glass py-4">
                <div className="container">
                    <p className="text-sm text-muted-foreground">Search / Not Found</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-20">
                <div className="flex flex-col items-center gap-6 max-w-md text-center">
                    {/* Icon */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>

                    {/* Message */}
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Search Not Found</h1>
                        <p className="text-muted-foreground">
                            This search result page doesn't exist. Try searching for cars using the search bar.
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
                            <RotateCcw className="h-4 w-4" />
                            New Search
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
