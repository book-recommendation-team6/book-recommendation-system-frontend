import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { MessageProvider } from './contexts/MessageProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MessageProvider>
        <App />
      </MessageProvider>
    </BrowserRouter>
  </StrictMode>
)
