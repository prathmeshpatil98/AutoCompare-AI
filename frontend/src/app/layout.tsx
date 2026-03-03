import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { CompareDrawer } from "@/components/listings/CompareDrawer";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: {
        template: "%s | AutoCompare AI",
        default: "AutoCompare AI - Find Your Perfect Car with AI"
    },
    description:
        "AI-powered car search engine that understands natural language. Describe what you want in plain words — brand, price, location, fuel type — and get instant results across all platforms.",
    keywords: ["used cars", "car search", "AI car finder", "CarDekho", "Cars24", "Spinny", "car comparison"],
    authors: [{ name: "AutoCompare AI Team" }],
    creator: "AutoCompare AI",
    publisher: "AutoCompare AI",
    formatDetection: {
        email: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://autocompare-ai.com",
        siteName: "AutoCompare AI",
        title: "AutoCompare AI - Find Your Perfect Car",
        description: "AI-powered car search engine that understands natural language.",
        images: [
            {
                url: "https://autocompare-ai.com/og-image.png",
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AutoCompare AI",
        description: "Find your perfect car with AI-powered search",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
    },
    alternates: {
        canonical: "https://autocompare-ai.com",
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="dark">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className={`${inter.variable} ${outfit.variable} font-sans`}>
                <QueryProvider>
                    <div className="flex min-h-screen flex-col bg-background text-foreground">
                        {/* Header */}
                        <Header />

                        {/* Page content — extra bottom padding for the compare drawer strip */}
                        <main className="flex-1 pb-20" role="main">
                            {children}
                        </main>

                        {/* Footer */}
                        <Footer />
                    </div>

                    {/* Compare drawer lives outside the page flow */}
                    <CompareDrawer />
                </QueryProvider>
            </body>
        </html>
    );
}
