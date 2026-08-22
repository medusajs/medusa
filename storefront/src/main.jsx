import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { StoreProvider } from './context/StoreContext';
import { AdminProvider } from './context/AdminContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <StoreProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </StoreProvider>
    </ThemeProvider>
  </React.StrictMode>
);
