import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ReactDOM from 'react-dom/client';
import './index.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./auth/AuthContext";
import { PrimeReactProvider} from 'primereact/api';

console.log("✅ AppProvider mounted");
// mock a 1.5s delay for GET /api/data
const mock = new MockAdapter(axios, {
  delayResponse: 1500,
  onNoMatch: "passthrough",
});
mock.onGet('/api/data').reply(200, { message: 'Hello from in-memory API!' });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
    <AuthProvider>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
    </AuthProvider>
    </AppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
