"use client";

import { CarListing } from "@/types/listing";
import { formatCurrency, cn } from "@/lib/utils";
import { ExternalLink, MapPin, Gauge, Fuel, Settings2, Calendar, Plus, Check, GitCompare, ImageOff } from "lucide-react";
import { useCompareStore, MAX_COMPARE_CARS } from "@/store/useCompareStore";
import { useState } from "react";

const FUEL_COLORS: Record<string, string> = {
    petrol: "pill-amber",
    diesel: "pill-cyan",
    electric: "pill-green",
    cng: "pill-purple",
};

interface CarCardProps {
    car: CarListing;
    view?: "grid" | "list";
    index?: number;
}

export function CarCard({ car, view = "grid", index = 0 }: CarCardProps) {
    const { addCar, removeCar, isAdded, cars } = useCompareStore();
    const added = isAdded(car.id);
    const compareDisabled = !added && cars.length >= MAX_COMPARE_CARS;
    const fuelClass = FUEL_COLORS[car.fuel_type?.toLowerCase() ?? ""] ?? "pill-muted";
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleCompare = () => {
        if (added) removeCar(car.id);
        else if (!compareDisabled) addCar(car);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    if (view === "list") {
        return (
            <div
                className="glass-card group flex overflow-hidden rounded-2xl border border-white/07 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/08 animate-card-appear"
                style={{ animationDelay: `${index * 0.05}s` }}
                role="article"
                aria-label={`${car.title} - ${formatCurrency(car.price)}`}
            >
                {/* Image */}
                <div className="relative w-52 shrink-0 overflow-hidden bg-muted/20">
                    {!imageError && car.thumbnail_url ? (
                        <>
                            {imageLoading && (
                                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20" />
                            )}
                            <img
                                src={car.thumbnail_url}
                                alt={car.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center flex-col gap-2 text-muted-foreground/50">
                            <ImageOff className="h-8 w-8" />
                            <span className="text-xs">No Image</span>
                        </div>
                    )}
                    <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                        {car.source_website}
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                        <div className="flex items-start justify-between gap-4">
                            <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                {car.title}
                            </h3>
                            <p className="shrink-0 text-xl font-black gradient-text-static" aria-label={`Price: ${formatCurrency(car.price)}`}>
                                {formatCurrency(car.price)}
                            </p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {car.fuel_type && <span className={fuelClass} title={`Fuel type: ${car.fuel_type}`}><Fuel className="h-3 w-3" aria-hidden="true" />{car.fuel_type}</span>}
                            {car.transmission && <span className="pill-muted" title={`Transmission: ${car.transmission}`}><Settings2 className="h-3 w-3" aria-hidden="true" />{car.transmission}</span>}
                            {car.year && <span className="pill-muted" title={`Year: ${car.year}`}><Calendar className="h-3 w-3" aria-hidden="true" />{car.year}</span>}
                            {car.mileage && <span className="pill-muted" title={`Mileage: ${car.mileage.toLocaleString()} km`}><Gauge className="h-3 w-3" aria-hidden="true" />{car.mileage.toLocaleString()} km</span>}
                            <span className="pill-muted" title={`Location: ${car.location}`}><MapPin className="h-3 w-3" aria-hidden="true" />{car.location}</span>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={handleCompare}
                            disabled={compareDisabled}
                            title={compareDisabled ? `Max ${MAX_COMPARE_CARS} cars for comparison` : added ? "Remove from comparison" : "Add to comparison"}
                            className={cn(
                                "flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200",
                                added ? "bg-primary/20 text-primary border border-primary/40 hover:bg-destructive/15 hover:text-destructive hover:border-destructive/40"
                                    : compareDisabled ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground"
                                        : "bg-white/04 border border-white/08 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                            )}
                            aria-label={compareDisabled ? `Cannot compare - maximum cars reached` : added ? `Remove ${car.title} from comparison` : `Add ${car.title} to comparison`}
                        >
                            {added ? <Check className="h-3.5 w-3.5" /> : <GitCompare className="h-3.5 w-3.5" />}
                            {added ? "Added" : "Compare"}
                        </button>
                        <a
                            href={car.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/15 border border-primary/25 py-2.5 text-xs font-semibold text-primary hover:bg-primary/25 transition-all hover:scale-[1.02]"
                            aria-label={`View ${car.title} on ${car.source_website} (opens in new window)`}
                        >
                            View on {car.source_website} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // GRID view
    return (
        <div
            className="glass-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/07 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/10 animate-card-appear"
            style={{ animationDelay: `${index * 0.06}s` }}
            role="article"
            aria-label={`${car.title} - ${formatCurrency(car.price)}`}
        >
            {/* Thumbnail */}
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-muted/10">
                {!imageError && car.thumbnail_url ? (
                    <>
                        {imageLoading && (
                            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 z-10" />
                        )}
                        <img
                            src={car.thumbnail_url}
                            alt={car.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                    </>
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary/80 to-secondary/30 text-muted-foreground/50">
                        <ImageOff className="h-12 w-12" />
                        <span className="text-xs">Image unavailable</span>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Source badge */}
                <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider">
                    {car.source_website}
                </div>

                {/* Year badge */}
                {car.year && (
                    <div className="absolute top-3 right-3 glass rounded-full px-2.5 py-1 text-[11px] font-bold">
                        {car.year}
                    </div>
                )}

                {/* Compare button overlay */}
                <button
                    onClick={handleCompare}
                    disabled={compareDisabled}
                    title={compareDisabled ? `Max ${MAX_COMPARE_CARS} cars for comparison` : added ? "Remove from comparison" : "Add to comparison"}
                    className={cn(
                        "absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-200 opacity-0 group-hover:opacity-100",
                        added ? "bg-primary text-primary-foreground hover:bg-destructive"
                            : compareDisabled ? "bg-black/50 text-muted-foreground cursor-not-allowed"
                                : "bg-black/70 backdrop-blur text-white hover:bg-primary/90"
                    )}
                    aria-label={compareDisabled ? `Cannot compare - maximum cars reached` : added ? `Remove ${car.title} from comparison` : `Add ${car.title} to comparison`}
                >
                    {added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {added ? "Added" : "Compare"}
                </button>
            </div>

            {/* Card body */}
            <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                    {car.title}
                </h3>

                <p className="mt-2 text-2xl font-black gradient-text-static" aria-label={`Price: ${formatCurrency(car.price)}`}>
                    {formatCurrency(car.price)}
                </p>

                {/* Spec badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {car.fuel_type && <span className={fuelClass} title={`Fuel type: ${car.fuel_type}`}><Fuel className="h-3 w-3" aria-hidden="true" />{car.fuel_type}</span>}
                    {car.transmission && <span className="pill-muted" title={`Transmission: ${car.transmission}`}><Settings2 className="h-3 w-3" aria-hidden="true" />{car.transmission}</span>}
                    {car.mileage && <span className="pill-muted" title={`Mileage: ${(car.mileage / 1000).toFixed(0)}k km`}><Gauge className="h-3 w-3" aria-hidden="true" />{(car.mileage / 1000).toFixed(0)}k km</span>}
                </div>

                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground" title={`Location: ${car.location}`}>
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    <span className="capitalize">{car.location}</span>
                </div>

                {/* Action */}
                <div className="mt-auto pt-4">
                    <a
                        href={car.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/04 border border-white/08 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-primary/15 hover:text-primary hover:border-primary/30 transition-all duration-200 active:scale-[0.98]"
                        aria-label={`View ${car.title} on ${car.source_website} (opens in new window)`}
                    >
                        View on {car.source_website}
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </div>
    );
}
