import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Configure base API URL
const API_URL = 'http://localhost:8000';
//const API_URL = 'https://be-cafeteria.onrender.com';

const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`,
      'Content-Type': 'application/json',
      ...options.headers,
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

export const useProducto = (id) => {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: () => fetchWithAuth(`/productos/${id}/`),
    enabled: !!id,
  });
};

export const useCreateProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (producto) => 
      fetchWithAuth('/productos/', {
        method: 'POST',
        body: JSON.stringify(producto),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
    },
  });
};

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...producto }) => 
      fetchWithAuth(`/productos/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(producto),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
    },
  });
};

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => 
      fetchWithAuth(`/productos/${id}/`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
    },
  });
};

export const usePedidos = () => {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: () => fetchWithAuth('/pedidos/'),
    staleTime: 1 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 10 * 1000,
  });
};

