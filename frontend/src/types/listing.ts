export interface CarListing {
    id: string;
    title: string;
    brand: string;
    model: string;
    price: number;
    year: number;
    mileage?: number;
    fuel_type?: string;
    transmission?: string;
    location: string;
    source_url: string;
    source_website: string;
    thumbnail_url?: string;
}
