import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ReservationProvider } from './contexts/ReservationContext'

// Força o tema claro no carregamento da página
document.documentElement.classList.remove('dark');
localStorage.setItem('theme', 'light');

createRoot(document.getElementById("root")!).render(
  <ReservationProvider>
    <App />
  </ReservationProvider>
);
