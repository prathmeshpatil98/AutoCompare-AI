import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { SearchResponse } from "@/types/search";

const fetchSearchResults = async (query: string): Promise<SearchResponse> => {
    if (!query) throw new Error("Query is required");
    const { data } = await apiClient.post<SearchResponse>('/search/', { query });
    return data;
};

export function useSearchCars(query: string) {
    return useQuery({
        queryKey: ["searchCars", query],
        queryFn: () => fetchSearchResults(query),
        enabled: !!query && query.length > 2,
        retry: 1,
    });
}
