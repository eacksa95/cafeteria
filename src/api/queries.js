import { useQuery, useMutation } from '@tanstack/react-query';

const API_URL = 'https://be-cafeteria.onrender.com';

const fetchWithAuth = async (url) => {
  const response = await fetch(`${API_URL}${url}`, {
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

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await fetch(`${API_URL}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    },
  });
};

export const useProductos = () => {
  return useQuery({
    queryKey: ['productos'],
    queryFn: () => fetchWithAuth('/productos/'),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePedidos = () => {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: () => fetchWithAuth('/pedidos/'),
    staleTime: 1 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  });
};
