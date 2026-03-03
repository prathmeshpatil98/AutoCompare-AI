"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { ResultsGrid } from "@/components/listings/ResultsGrid";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { useSearchCars } from "@/hooks/queries/useSearchCars";
import { cn } from "@/lib/utils";
import {
    LayoutGrid, List, SortAsc, SortDesc, ArrowUpDown,
    Sparkles, AlertCircle
} from "lucide-react";

type SortKey = "price_asc" | "price_desc" | "year_desc" | "year_asc" | "mileage_asc";

const SORT_OPTIONS: { label: string; key: SortKey; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: "Price ↑", key: "price_asc", icon: SortAsc },
    { label: "Price ↓", key: "price_desc", icon: SortDesc },
    { label: "Newest", key: "year_desc", icon: SortDesc },
    { label: "Oldest", key: "year_asc", icon: SortAsc },
    { label: "Low Mileage", key: "mileage_asc", icon: ArrowUpDown },
];

function SkeletonCard() {
    return (
        <div className="glass-card rounded-2xl border border-white/05 overflow-hidden animate-pulse">
            <div className="shimmer-bg aspect-[16/11] w-full" />
            <div className="p-5 space-y-3">
                <div className="shimmer-bg h-4 rounded-lg w-3/4" />
                <div className="shimmer-bg h-6 rounded-lg w-1/2" />
                <div className="flex gap-2">
                    <div className="shimmer-bg h-5 rounded-full w-16" />
                    <div className="shimmer-bg h-5 rounded-full w-20" />
                </div>
                <div className="shimmer-bg h-9 rounded-xl w-full mt-2" />
            </div>
        </div>
    );
}

function LoadingGrid() {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <div className="shimmer-bg h-5 w-32 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        </div>
    );
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortKey, setSortKey] = useState<SortKey>("price_asc");

    const { data, isLoading, error } = useSearchCars(query);

    return (
        <div className="min-h-screen">
            {/* Sticky top search bar */}
            <div className="sticky top-16 z-30 border-b border-white/06 glass py-4">
                <div className="container">
                    <SearchBar initialQuery={query} />
                </div>
            </div>

            <div className="container py-8">
                {/* AI filter tags */}
                {data?.parsed_query && Object.values(data.parsed_query).some(v => v !== null) && (
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                            <Sparkles className="h-3.5 w-3.5 text-primary" /> AI parsed:
                        </div>
                        {Object.entries(data.parsed_query)
                            .filter(([_, val]) => val !== null)
                            .map(([key, val]) => (
                                <span key={key} className="pill-primary">
                                    {key.replace(/_/g, " ")}: {String(val)}
                                </span>
                            ))}
                    </div>
                )}

                {/* Controls bar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    {/* Sort options */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-muted-foreground">Sort:</span>
                        {SORT_OPTIONS.map(({ label, key }) => (
                            <button
                                key={key}
                                onClick={() => setSortKey(key)}
                                className={cn(
                                    "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                                    sortKey === key
                                        ? "bg-primary/20 text-primary border border-primary/35"
                                        : "bg-white/03 border border-white/07 text-muted-foreground hover:bg-white/07 hover:text-foreground"
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* View toggle */}
                    <div className="flex items-center gap-1 rounded-xl border border-white/07 bg-white/03 p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150",
                                viewMode === "grid" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150",
                                viewMode === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Main layout */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
                    {/* Sidebar */}
                    <div className="hidden md:block">
                        <FilterSidebar parsedFilters={data?.parsed_query} />
                    </div>

                    {/* Results */}
                    <div>
                        {isLoading ? (
                            <LoadingGrid />
                        ) : error ? (
                            <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/05 text-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                                    <AlertCircle className="h-7 w-7 text-destructive" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Search failed</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">The backend might be down. Check that Redis and Elasticsearch are running.</p>
                                </div>
                            </div>
                        ) : !query ? (
                            <div className="flex h-[400px] flex-col items-center justify-center gap-5 text-center">
                                <div className="h-20 w-20 rounded-full bg-primary/08 flex items-center justify-center animate-float">
                                    <Sparkles className="h-10 w-10 text-primary/60" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Start searching</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">Type a query above to find your perfect car</p>
                                </div>
                            </div>
                        ) : (
                            <ResultsGrid
                                listings={data?.results || []}
                                total={data?.total || 0}
                                viewMode={viewMode}
                                sortKey={sortKey}
                                source={data?.source}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
