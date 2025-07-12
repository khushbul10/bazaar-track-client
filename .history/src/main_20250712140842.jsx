import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import { router } from './routes/router.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './contexts/AuthProvider.jsx'
const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider
    </QueryClientProvider>
  </StrictMode>,
)
