// src/hooks/useTraffic.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Создаём инстанс axios с базовым URL API
const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Хук для получения DAU/MAU
 * @param {'30d' | '6m'} period - период для аналитики
 */
export function useTraffic(period) {
  return useQuery({
    queryKey: ['traffic', period],
    queryFn: async () => {
      // Добавляем cache-buster в параметры, без кастомных заголовков
      const timestamp = Date.now();
      const response = await api.get('/analytics/traffic', {
        params: { period, _ts: timestamp }
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // кеш 5 минут
    refetchOnWindowFocus: false,
  });
}
