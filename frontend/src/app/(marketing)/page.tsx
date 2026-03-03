import { SearchBar } from "@/components/search/SearchBar";

const POPULAR_SEARCHES = [
    "Maruti Swift under 5 lakh",
    "Honda City automatic Delhi",
    "Electric car Bangalore",
    "Hyundai i20 petrol Pune",
    "Toyota Fortuner 2022",
    "Tata Nexon EV",
];

const HOW_IT_WORKS = [
    {
        icon: "✍️",
        title: "Describe in Plain Words",
        desc: "Type what you want naturally — brand, budget, city, fuel type. No forms to fill.",
    },
    {
        icon: "🤖",
        title: "AI Parses Your Intent",
        desc: "Our Groq-powered AI extracts filters instantly, then maps them to a structured search.",
    },
    {
        icon: "⚡",
        title: "Get Aggregated Results",
        desc: "We search across Cardekho, Cars24, Spinny and more — cached for instant speed.",
    },
];

const STATS = [
    { value: "50,000+", label: "Car Listings" },
    { value: "12+", label: "Platforms" },
    { value: "150+", label: "Cities" },
    { value: "< 1s", label: "AI Parse Time" },
];

export default function MarketingPage() {
    return (
        <div className="relative overflow-x-hidden">
            {/* ── HERO ── */}
            <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-24">
                {/* Animated background orbs */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-[15%] left-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/12 blur-[120px] animate-blob" />
                    <div className="absolute top-[40%] right-[8%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px] animate-blob" style={{ animationDelay: "3s" }} />
                    <div className="absolute bottom-[10%] left-[35%] h-[350px] w-[350px] rounded-full bg-cyan-500/08 blur-[100px] animate-blob" style={{ animationDelay: "6s" }} />

                    {/* Grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
                            backgroundSize: "60px 60px",
                        }}
                    />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-10 text-center max-w-5xl mx-auto">

                    {/* Badge */}
                    <div className="animate-fade-in-up">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/08 px-4 py-1.5 text-sm font-semibold text-primary">
                            <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                            Powered by Groq · Elasticsearch · Redis
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="animate-fade-in-up space-y-4" style={{ animationDelay: "0.1s" }}>
                        <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05]">
                            Find Your{" "}
                            <span className="gradient-text">Dream Car</span>
                            <br />
                            in Plain English
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
                            The AI-powered search engine that understands what you want. Just describe it — brand, budget, city, and more. We do the rest across every major platform.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="animate-fade-in-up w-full max-w-3xl" style={{ animationDelay: "0.2s" }}>
                        <SearchBar size="xl" />
                    </div>

                    {/* Popular searches */}
                    <div className="animate-fade-in-up flex flex-wrap justify-center gap-2.5" style={{ animationDelay: "0.35s" }}>
                        <span className="text-xs font-semibold text-muted-foreground/70 self-center">Try:</span>
                        {POPULAR_SEARCHES.map((q) => (
                            <a
                                key={q}
                                href={`/search?q=${encodeURIComponent(q)}`}
                                className="rounded-full border border-white/08 bg-white/03 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/08 hover:text-primary transition-all duration-200"
                            >
                                {q}
                            </a>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="animate-fade-in-up grid grid-cols-2 gap-4 sm:grid-cols-4 w-full max-w-2xl" style={{ animationDelay: "0.45s" }}>
                        {STATS.map(({ value, label }) => (
                            <div key={label} className="glass-card rounded-xl px-4 py-4 text-center">
                                <div className="text-2xl font-black gradient-text">{value}</div>
                                <div className="mt-1 text-xs font-medium text-muted-foreground">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40 animate-float">
                    <span className="text-xs font-medium tracking-wide uppercase">Scroll</span>
                    <div className="h-8 w-px bg-gradient-to-b from-muted-foreground/40 to-transparent" />
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="relative py-24 px-4 border-t border-white/06">
                <div className="container max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Simple by design</p>
                        <h2 className="text-4xl font-black tracking-tight">How It Works</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {HOW_IT_WORKS.map(({ icon, title, desc }, i) => (
                            <div
                                key={title}
                                className="glass-card rounded-2xl p-8 flex flex-col gap-4 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                                    {icon}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Step {i + 1}</div>
                                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 px-4">
                <div className="container max-w-3xl mx-auto text-center">
                    <div className="glass-card rounded-3xl p-12 gradient-border">
                        <h2 className="text-4xl font-black tracking-tight mb-4">
                            Ready to find your <span className="gradient-text">perfect car</span>?
                        </h2>
                        <p className="text-muted-foreground mb-8 text-lg">
                            No sign-up required. Just describe what you want and start comparing.
                        </p>
                        <a
                            href="/search?q=best+cars+under+8+lakh"
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg shadow-primary/25"
                        >
                            Start Searching Now →
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
