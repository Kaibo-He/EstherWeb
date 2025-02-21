import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import config from './config';

import App from './App';

const setGlobalCSSVariables = () => {
  document.documentElement.style.setProperty('--fontSize-xs', config.fontSizeXS);
  document.documentElement.style.setProperty('--fontSize-s', config.fontSizeS);
  document.documentElement.style.setProperty('--fontSize-m', config.fontSizeM);
  document.documentElement.style.setProperty('--fontSize-l', config.fontSizeL);
  document.documentElement.style.setProperty('--fontSize-xl', config.fontSizeXL);
  document.documentElement.style.setProperty('--font-sys', config.systemFont);
  document.documentElement.style.setProperty('--font-text', config.textFont);
};

setGlobalCSSVariables();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);