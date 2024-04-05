import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';
import './Global/index.css';
import { DataProvider } from './Provider/DataProvider';
import { EffectProvider } from './Provider/EffectProvider';
import reportWebVitals from './reportWebVitals';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <CookiesProvider>
        <DataProvider>
          <EffectProvider>
            <App />
          </EffectProvider>
        </DataProvider>
      </CookiesProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
