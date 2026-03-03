"use client";

import { CarListing } from "@/types/listing";
import { CarCard } from "./CarCard";
import { Car, Search } from "lucide-react";

type SortKey = "price_asc" | "price_desc" | "year_desc" | "year_asc" | "mileage_asc";

function sortListings(listings: CarListing[], sortKey: SortKey): CarListing[] {
    return [...listings].sort((a, b) => {
        switch (sortKey) {
            case "price_asc": return a.price - b.price;
            case "price_desc": return b.price - a.price;
            case "year_desc": return (b.year ?? 0) - (a.year ?? 0);
            case "year_asc": return (a.year ?? 0) - (b.year ?? 0);
            case "mileage_asc": return (a.mileage ?? Infinity) - (b.mileage ?? Infinity);
            default: return 0;
        }
    });
}

interface ResultsGridProps {
    listings: CarListing[];
    total: number;
    viewMode?: "grid" | "list";
    sortKey?: SortKey;
    source?: string;
}

export function ResultsGrid({
    listings,
    total,
    viewMode = "grid",
    sortKey = "price_asc",
    source,
}: ResultsGridProps) {
    if (listings.length === 0) {
        return (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/08 bg-white/[0.01] text-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/20 animate-float">
                    <Car className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-foreground">No cars found</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Try adjusting your query. Example:{" "}
                        <span className="text-primary font-medium">"Honda City Automatic in Delhi"</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/08 bg-white/03 px-4 py-2 text-xs text-muted-foreground">
                    <Search className="h-3.5 w-3.5" /> Try a different search
                </div>
            </div>
        );
    }

    const sorted = sortListings(listings, sortKey);

    return (
        <div className="space-y-5">
            {/* Result header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold">
                        <span className="gradient-text-static">{total.toLocaleString()}</span>{" "}
                        <span className="text-muted-foreground font-normal">cars found</span>
                    </h2>
                    {source && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Source: <span className={`font-semibold ${source === "redis_cache" ? "text-cyan-400" : "text-emerald-400"}`}>
                                {source === "redis_cache" ? "⚡ Cached" : "🔍 Live Search"}
                            </span>
                        </p>
                    )}
                </div>
            </div>

            {/* Grid or List */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sorted.map((car, i) => (
                        <CarCard key={car.id} car={car} view="grid" index={i} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {sorted.map((car, i) => (
                        <CarCard key={car.id} car={car} view="list" index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}
