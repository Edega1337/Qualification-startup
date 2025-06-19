import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Создаём инстанс axios с базовым URL API
const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

export function useRetention(days) {
  return useQuery({
    queryKey: ['retention', days],
    queryFn: async () => {
      const response = await api.get('/analytics/retention', { params: { days } });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}