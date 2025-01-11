import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './components/ui/toast.tsx'
import { Toaster } from './components/ui/toaster.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <StrictMode>
       <ToastProvider>
        <App />
        <Toaster />
       </ToastProvider>
      </StrictMode>
  </BrowserRouter>
)
