import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { monitorPerformance } from './utils/performance';
import { initializeAnalytics } from './utils/analytics';

// Initialize analytics
initializeAnalytics();

// Monitor performance metrics
monitorPerformance();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
