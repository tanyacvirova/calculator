//import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App.js';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode> // Строгий режим лучше не выключать, но нужно учитывать что некоторые хуки могут срабатывать дважды в режиме разработки
    <App />
  //</React.StrictMode>
);

reportWebVitals();
