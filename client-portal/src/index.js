import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@ant-design/v5-patch-for-react-19';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from './contexts/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>

);

reportWebVitals();
