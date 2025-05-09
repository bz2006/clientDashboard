import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@ant-design/v5-patch-for-react-19';
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
       <BrowserRouter>
         <App />
       </BrowserRouter>
     </ThemeProvider>
  </StrictMode>,
)
