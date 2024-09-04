import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path='/*'
          element={
            <ThemeProvider theme={theme}>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <App />
                </PersistGate>
              </Provider>
            </ThemeProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);