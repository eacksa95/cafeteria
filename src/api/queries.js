
import { useQuery, useMutation } from '@tanstack/react-query';

// Configura la URL base del API
const API_URL = 'http://localhost:8000';
//const API_URL = 'https://be-cafeteria.onrender.com';

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
      try {
        const response = await fetch(`${API_URL}/api/token/`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Credenciales inválidas');
        }

        return response.json();
      } catch (error) {
        if (error.message === 'Failed to fetch') {
          throw new Error('No se pudo conectar al servidor. Por favor, verifica tu conexión.');
        }
        throw error;
      }
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