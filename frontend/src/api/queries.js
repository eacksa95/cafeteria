import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Configure base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

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

/*LOGIN QUERY*/

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

/* USER QUERIES */
export const useUser = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchWithAuth(`/users/${userId}/`),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetchWithAuth('/users/'),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (user) => 
      fetchWithAuth('/users/', {
        method: 'POST',
        body: JSON.stringify(user),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...user }) => 
      fetchWithAuth(`/users/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(user),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => 
      fetchWithAuth(`/users/${id}/`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};


/*PRODUCTOS QUERIES */

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

/* PEDIDOS QUERIES */

export const usePedidos = () => {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: () => fetchWithAuth('/pedidos/'),
    staleTime: 1 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 10 * 1000,
  });
};


export const usePedido = (id) => {
  return useQuery({
    queryKey: ['pedidos', id],
    queryFn: () => fetchWithAuth(`/pedidos/${id}/`),
    enabled: !!id,
  });
};

export const useCreatePedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (pedido) => 
      fetchWithAuth('/pedidos/', {
        method: 'POST',
        body: JSON.stringify(pedido),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['pedidos']);
    },
  });
};

export const useUpdatePedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...pedidos }) => 
      fetchWithAuth(`/pedidos/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(pedido),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['pedidos']);
    },
  });
};

export const useDeletePedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => 
      fetchWithAuth(`/pedidos/${id}/`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['pedidos']);
    },
  });
};