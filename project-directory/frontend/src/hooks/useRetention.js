import { useQuery } from '@tanstack/react-query';
import api from '../http';



export function useRetention(days) {
  return useQuery({
    queryKey: ['retention', days],
    queryFn: async () => {
      const response = await api.get('/analytics/retention', {
        params: { days },
      });

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
