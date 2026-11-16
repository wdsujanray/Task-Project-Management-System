import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import favicon from '../../assets/images/fevico.png';
import './index.css';
import App from './App.jsx';

const faviconLink = document.createElement('link');
faviconLink.rel = 'icon';
faviconLink.type = 'image/png';
faviconLink.href = favicon;
document.head.append(faviconLink);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
