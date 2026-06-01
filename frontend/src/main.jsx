import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './index.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

// Prefetch de datos públicos al arrancar la app (sin auth)
// Esto pre-warmea el cache para /carta, /carrito y filtros de productos
queryClient.prefetchQuery({
  queryKey: ['categorias'],
  queryFn: () => fetch(`${API_URL}/categorias/`).then(r => r.json()),
  staleTime: 10 * 60 * 1000,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
