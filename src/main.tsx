import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import store from './redux/store';
import { Provider } from 'react-redux';
import {NextUIProvider} from "@nextui-org/react";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <NextUIProvider> 
    <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
  </NextUIProvider>
 
)
