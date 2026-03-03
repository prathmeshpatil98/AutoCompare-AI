"use client";

import { ParsedQuery } from "@/types/search";
import { formatCurrency, cn } from "@/lib/utils";
import { SlidersHorizontal, ChevronDown, X, Fuel, Settings2, MapPin, DollarSign, Car } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
    parsedFilters?: ParsedQuery;
    onClearFilter?: (key: keyof ParsedQuery) => void;
}

function AccordionSection({ label, icon: Icon, defaultOpen = true, children }: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-white/06 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between py-4 text-left group"
            >
                <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-primary/70" />
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
            </button>
            {open && <div className="pb-4">{children}</div>}
        </div>
    );
}

export function FilterSidebar({ parsedFilters, onClearFilter }: FilterSidebarProps) {
    const hasFilters = parsedFilters && Object.values(parsedFilters).some(v => v !== null);

    return (
        <div className="sticky top-24 rounded-2xl glass-card border border-white/07 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/06">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
                        <SlidersHorizontal className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm">AI Filters</h3>
                </div>
                {hasFilters && (
                    <span className="text-xs text-primary font-medium">Active</span>
                )}
            </div>

            {!hasFilters ? (
                <div className="flex flex-col items-center justify-center py-10 px-5 text-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center">
                        <SlidersHorizontal className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Search for cars to see AI-parsed filters
                    </p>
                </div>
            ) : (
                <div className="px-5">
                    {/* Price */}
                    <AccordionSection label="Price Range" icon={DollarSign}>
                        {parsedFilters?.price_min || parsedFilters?.price_max ? (
                            <FilterPill
                                value={`${parsedFilters.price_min ? formatCurrency(parsedFilters.price_min) : "₹0"} – ${parsedFilters.price_max ? formatCurrency(parsedFilters.price_max) : "Any"}`}
                                onRemove={onClearFilter ? () => { onClearFilter?.("price_min"); onClearFilter?.("price_max"); } : undefined}
                            />
                        ) : (
                            <EmptyFilter>Any Price</EmptyFilter>
                        )}
                    </AccordionSection>

                    {/* Brand & Model */}
                    <AccordionSection label="Make & Model" icon={Car}>
                        {parsedFilters?.brand ? (
                            <div className="flex flex-wrap gap-2">
                                <FilterPill value={parsedFilters.brand} onRemove={onClearFilter ? () => onClearFilter("brand") : undefined} />
                                {parsedFilters?.model && (
                                    <FilterPill value={parsedFilters.model} onRemove={onClearFilter ? () => onClearFilter("model") : undefined} />
                                )}
                            </div>
                        ) : (
                            <EmptyFilter>Any Brand</EmptyFilter>
                        )}
                    </AccordionSection>

                    {/* Fuel Type */}
                    <AccordionSection label="Fuel Type" icon={Fuel}>
                        {parsedFilters?.fuel_type ? (
                            <FilterPill value={parsedFilters.fuel_type} onRemove={onClearFilter ? () => onClearFilter("fuel_type") : undefined} />
                        ) : (
                            <EmptyFilter>Any Fuel</EmptyFilter>
                        )}
                    </AccordionSection>

                    {/* Transmission */}
                    <AccordionSection label="Transmission" icon={Settings2}>
                        {parsedFilters?.transmission ? (
                            <FilterPill value={parsedFilters.transmission} onRemove={onClearFilter ? () => onClearFilter("transmission") : undefined} />
                        ) : (
                            <EmptyFilter>Any</EmptyFilter>
                        )}
                    </AccordionSection>

                    {/* Location */}
                    <AccordionSection label="Location" icon={MapPin} defaultOpen={false}>
                        {parsedFilters?.location ? (
                            <FilterPill value={parsedFilters.location} onRemove={onClearFilter ? () => onClearFilter("location") : undefined} />
                        ) : (
                            <EmptyFilter>Any City</EmptyFilter>
                        )}
                    </AccordionSection>
                </div>
            )}

            {hasFilters && (
                <div className="px-5 pb-5 pt-2">
                    <p className="text-[11px] text-muted-foreground/60 leading-relaxed text-center">
                        Filters extracted from your natural language query by AI
                    </p>
                </div>
            )}
        </div>
    );
}

function FilterPill({ value, onRemove }: { value: string; onRemove?: () => void }) {
    return (
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary">
            <span className="capitalize">{value}</span>
            {onRemove && (
                <button onClick={onRemove} className="text-primary/60 hover:text-primary transition-colors ml-0.5">
                    <X className="h-3 w-3" />
                </button>
            )}
        </div>
    );
}

function EmptyFilter({ children }: { children: React.ReactNode }) {
    return <span className="text-xs italic text-muted-foreground/50">{children}</span>;
}
