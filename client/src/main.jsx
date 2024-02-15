import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StricMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  // </React.StricMode>,
)
