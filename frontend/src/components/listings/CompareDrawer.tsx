"use client";

import { useCompareStore } from "@/store/useCompareStore";
import { formatCurrency } from "@/lib/utils";
import { X, GitCompare, Trash2, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function CompareDrawer() {
    const { cars, isOpen, removeCar, clearAll, setOpen } = useCompareStore();

    // Close on Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [setOpen]);

    if (cars.length === 0) return null;

    const specs = [
        { label: "Price", key: "price", fmt: (v: number) => formatCurrency(v) },
        { label: "Year", key: "year", fmt: (v: number) => String(v) },
        { label: "Mileage", key: "mileage", fmt: (v: number) => v ? `${v.toLocaleString()} km` : "—" },
        { label: "Fuel", key: "fuel_type", fmt: (v: string) => v ?? "—" },
        { label: "Trans.", key: "transmission", fmt: (v: string) => v ?? "—" },
        { label: "Location", key: "location", fmt: (v: string) => v ?? "—" },
    ] as const;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Collapsed trigger strip */}
            {!isOpen && (
                <div
                    className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 glass-strong border-t border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setOpen(true)}
                >
                    <div className="flex items-center gap-3">
                        <GitCompare width="20" height="20" className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-sm text-foreground">
                            Compare {cars.length} car{cars.length > 1 ? "s" : ""}
                        </span>
                        <div className="flex gap-2">
                            {cars.map((c) => (
                                <span key={c.id} className="pill-primary truncate max-w-[120px]">{c.title}</span>
                            ))}
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground">Click to expand ↑</span>
                </div>
            )}

            {/* Full Drawer */}
            {isOpen && (
                <div className={cn(
                    "fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl glass-strong border-t border-white/10 animate-drawer",
                )}>
                    {/* Drag handle + header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between p-5 pb-4 border-b border-white/08 glass-strong">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
                                <GitCompare width="20" height="20" className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Compare Cars</h3>
                                <p className="text-xs text-muted-foreground">Side-by-side comparison</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={clearAll}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" /> Clear all
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/08 transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="p-5">
                        {/* Car thumbnail headers */}
                        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${cars.length}, 1fr)` }}>
                            {cars.map((car) => (
                                <div key={car.id} className="relative rounded-xl overflow-hidden bg-secondary/50 border border-white/07">
                                    <div className="aspect-[16/9] overflow-hidden">
                                        {car.thumbnail_url ? (
                                            <img src={car.thumbnail_url} alt={car.title} className="w-full h-full object-cover" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium bg-muted/20">No Image</div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeCar(car.id)}
                                        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-destructive/80 transition-colors group"
                                        aria-label={`Remove ${car.title} from comparison`}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground group-hover:text-white" />
                                    </button>
                                    <div className="p-3">
                                        <p className="text-sm font-bold line-clamp-2 leading-tight">{car.title}</p>
                                        <p className="text-xl font-black gradient-text-static mt-1">{formatCurrency(car.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Spec comparison table */}
                        <div className="rounded-xl border border-white/07 overflow-hidden">
                            {specs.map(({ label, key, fmt }, i) => (
                                <div
                                    key={key}
                                    className="grid gap-4 px-4 py-3"
                                    style={{
                                        gridTemplateColumns: `120px repeat(${cars.length}, 1fr)`,
                                        backgroundColor: i % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "transparent"
                                    }}
                                >
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide self-center">{label}</span>
                                    {cars.map((car) => {
                                        const val = (car as any)[key];
                                        return (
                                            <span key={car.id} className="text-sm font-medium text-foreground">
                                                {fmt(val as never)}
                                            </span>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* CTA row */}
                        <div className="grid gap-4 mt-5" style={{ gridTemplateColumns: `repeat(${cars.length}, 1fr)` }}>
                            {cars.map((car) => (
                                <a
                                    key={car.id}
                                    href={car.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/30 py-2.5 text-sm font-semibold text-primary transition-all hover:scale-[1.02]"
                                    aria-label={`View ${car.title} on original platform`}
                                >
                                    View <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
