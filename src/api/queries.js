import { useQuery } from '@tanstack/react-query';

const fetchWithAuth = async (url) => {
  const response = await fetch(`http://localhost:8000${url}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
};

export const useProductos = () => {
  return useQuery({
    queryKey: ['productos'],
    queryFn: () => fetchWithAuth('/productos/'),
    staleTime: 5 * 60 * 1000, // Datos considerados frescos por 5 minutos
    cacheTime: 30 * 60 * 1000, // Mantener en caché por 30 minutos
    refetchOnWindowFocus: false, // No recargar al volver a la ventana
  });
};

export const usePedidos = () => {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: () => fetchWithAuth('/pedidos/'),
    staleTime: 1 * 60 * 1000, // Datos considerados frescos por 1 minuto
    cacheTime: 5 * 60 * 1000, // Mantener en caché por 5 minutos
    refetchInterval: 10 * 1000, // Recargar cada 30 segundos
  });
};