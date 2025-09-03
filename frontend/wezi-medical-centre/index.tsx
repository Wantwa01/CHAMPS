
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Starting Wezi Medical Centre application...');
console.log('React available:', typeof React);
console.log('ReactDOM available:', typeof ReactDOM);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log('Root element found:', rootElement);

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
