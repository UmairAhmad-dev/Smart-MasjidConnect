// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
// 1. Import BrowserRouter from react-router-dom
import { BrowserRouter } from 'react-router-dom'
import App from './App'
// Your index.css should be empty if you used the Emergency CDN Fix!
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap the entire App in BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)