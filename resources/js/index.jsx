import React from "react";
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '../css/app.css'
import AppContextProvider from './context/AppContext.jsx';
import ErrorBoundary from "./errorBoundry.jsx";

createRoot(document.getElementById('app')).render(
    <ErrorBoundary>
        <AppContextProvider>
            <App />
        </AppContextProvider>
    </ErrorBoundary>

)
