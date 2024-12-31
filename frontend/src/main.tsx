import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Toast, ToastProvider } from './components/ui/toast.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <StrictMode>
       <ToastProvider>
        <App />
        <Toast />
       </ToastProvider>
       
      </StrictMode>
  </BrowserRouter>
)
