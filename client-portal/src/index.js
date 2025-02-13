import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from './contexts/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <ThemeProvider>
    <BrowserRouter basename='/client'>
      <App />
    </BrowserRouter>
  </ThemeProvider>

);

reportWebVitals();
