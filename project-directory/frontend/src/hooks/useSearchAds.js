import { useQuery } from "@tanstack/react-query";

export const useSearchAds = (searchTerm, filters, page = 0, limit = 5) => {
  const queryParams = new URLSearchParams();

  if (searchTerm) queryParams.append("name", searchTerm);
  if (filters?.typeOfTrening) queryParams.append("typeOfTrening", filters.typeOfTrening);
  if (filters?.minPrice) queryParams.append("minPrice", filters.minPrice);
  if (filters?.maxPrice && filters.maxPrice !== Infinity) queryParams.append("maxPrice", filters.maxPrice);

  queryParams.append("limit", limit);
  queryParams.append("offset", page * limit);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["ads", queryString],
    queryFn: async () => {
      const res = await fetch(`http://localhost:4000/ads/search?${queryString}`);
      if (!res.ok) throw new Error("Ошибка при загрузке объявлений");
      return res.json();
    },
    keepPreviousData: true,
  });
};
