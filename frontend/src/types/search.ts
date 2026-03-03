import { CarListing } from "./listing";

export interface ParsedQuery {
    brand: string | null;
    model: string | null;
    price_min: number | null;
    price_max: number | null;
    location: string | null;
    fuel_type: string | null;
    transmission: string | null;
}

export interface SearchRequest {
    query: string;
}

export interface SearchResponse {
    parsed_query: ParsedQuery;
    results: CarListing[];
    total: number;
    source: string;
}
