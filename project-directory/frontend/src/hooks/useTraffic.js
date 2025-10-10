import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});


export function useTraffic(period) {
  return useQuery({
    queryKey: ['traffic', period],
    queryFn: async () => {

      const timestamp = Date.now();
      const response = await api.get('/analytics/traffic', {
        params: { period, _ts: timestamp }
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
