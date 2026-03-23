import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TutorialProvider } from './contexts/TutorialContext';
import { ToastProvider } from './contexts/ToastContext';
import App from './App';
import { reportWebVitals } from './utils/webVitals';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TutorialProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </TutorialProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Register Web Vitals reporting
reportWebVitals();
