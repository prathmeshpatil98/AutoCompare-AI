"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { Search, Sparkles, Clock, X, ArrowRight, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const HISTORY_KEY = "autocompare_search_history";
const MAX_HISTORY = 5;
const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 200;

const QUICK_CHIPS = [
    "Honda City automatic",
    "Maruti under 5 lakh",
    "EV in Bangalore",
    "SUV diesel 2022",
];

function getHistory(): string[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
        return [];
    }
}

function saveHistory(query: string) {
    const existing = getHistory().filter((q) => q !== query);
    const updated = [query, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function SearchBar({
    initialQuery = "",
    className,
    size = "default",
}: {
    initialQuery?: string;
    className?: string;
    size?: "default" | "xl";
}) {
    const [query, setQuery] = useState(initialQuery);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHistory(getHistory());
    }, [isFocused]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const validateQuery = (q: string): string => {
        const trimmed = q.trim();
        if (!trimmed) return "Please enter a search query";
        if (trimmed.length < MIN_QUERY_LENGTH) return `Query must be at least ${MIN_QUERY_LENGTH} characters`;
        if (trimmed.length > MAX_QUERY_LENGTH) return `Query cannot exceed ${MAX_QUERY_LENGTH} characters`;
        return "";
    };

    const handleSearch = (q: string) => {
        const validationError = validateQuery(q);
        if (validationError) {
            setError(validationError);
            return;
        }
        
        setError("");
        const trimmed = q.trim();
        setIsLoading(true);
        saveHistory(trimmed);
        setIsFocused(false);
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        setTimeout(() => setIsLoading(false), 1500);
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSearch(query);
    };

    const handleQueryChange = (value: string) => {
        setQuery(value);
        if (error) setError(""); // Clear error as user types
    };

    const showDropdown = isFocused && (history.length > 0 || QUICK_CHIPS.length > 0);
    const queryLength = query.trim().length;
    const isValidQuery = queryLength >= MIN_QUERY_LENGTH && queryLength <= MAX_QUERY_LENGTH;

    return (
        <div ref={wrapperRef} className="relative w-full">
            <form
                onSubmit={onSubmit}
                className={cn(
                    "relative flex w-full items-center overflow-hidden transition-all duration-300",
                    "rounded-2xl glass-strong border",
                    error ? "border-destructive/50 ring-2 ring-destructive/20" : isFocused ? "border-primary/50 shadow-lg shadow-primary/15 ring-2 ring-primary/20" : "border-white/10 hover:border-white/15",
                    size === "xl" ? "h-16" : "h-13",
                    className
                )}
                noValidate
            >
                {/* Icon */}
                <div className="flex h-full items-center pl-5 pr-3">
                    <Sparkles className={cn("h-5 w-5 transition-colors", isFocused ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Try: 'Hyundai i20 under 6 lakh in Pune automatic'"
                    className={cn(
                        "flex-1 bg-transparent outline-none placeholder:text-muted-foreground/50 text-foreground",
                        size === "xl" ? "text-lg" : "text-sm"
                    )}
                    maxLength={MAX_QUERY_LENGTH}
                    aria-label="Search for cars"
                    aria-describedby={error ? "search-error" : "search-help"}
                    aria-invalid={!!error}
                />

                {/* Clear button */}
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            setError("");
                        }}
                        className="mr-2 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-white/08 hover:text-foreground transition-colors"
                        aria-label="Clear search input"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isLoading || !isValidQuery}
                    className={cn(
                        "group m-2 flex items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground",
                        "transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                        size === "xl" ? "h-12 px-7 text-base" : "h-9 px-5 text-sm"
                    )}
                    aria-label="Search for cars"
                >
                    {isLoading ? (
                        <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" aria-hidden="true" />
                    ) : (
                        <>
                            <span className="hidden sm:inline">Search</span>
                            <Search className="h-4 w-4 sm:hidden" aria-hidden="true" />
                            <ArrowRight className="h-4 w-4 hidden sm:block group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                        </>
                    )}
                </button>
            </form>

            {/* Error message */}
            {error && (
                <div
                    id="search-error"
                    role="alert"
                    className="mt-2 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive"
                >
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}

            {/* Help text */}
            {!error && (
                <div id="search-help" className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Describe your ideal car in natural language</span>
                    {queryLength > 0 && (
                        <span className={queryLength > MAX_QUERY_LENGTH * 0.8 ? "text-amber-500" : ""}>
                            {queryLength}/{MAX_QUERY_LENGTH}
                        </span>
                    )}
                </div>
            )}

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl glass-strong border border-white/10 shadow-xl overflow-hidden animate-fade-in-up">
                    {history.length > 0 && (
                        <div className="p-2">
                            <div className="flex items-center justify-between px-3 py-1.5">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent</span>
                                <button
                                    type="button"
                                    onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]); }}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label="Clear search history"
                                >
                                    Clear
                                </button>
                            </div>
                            {history.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => { setQuery(q); handleSearch(q); }}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left hover:bg-white/05 transition-colors group"
                                >
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden="true" />
                                    <span className="flex-1 text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1">{q}</span>
                                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-all" aria-hidden="true" />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-white/06 p-3">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-2">Popular</div>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_CHIPS.map((chip) => (
                                <button
                                    key={chip}
                                    type="button"
                                    onClick={() => { setQuery(chip); handleSearch(chip); }}
                                    className="rounded-full border border-white/08 bg-white/03 px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/08 hover:text-primary transition-all"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
