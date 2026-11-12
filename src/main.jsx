import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, MemoryRouter } from 'react-router-dom'
import '@fontsource/baloo-2/latin-600.css'
import '@fontsource/baloo-2/latin-800.css'
import '@fontsource/nunito/latin-600.css'
import '@fontsource/nunito/latin-700.css'
import '@fontsource/nunito/latin-800.css'
import './index.css'
import App from './App.jsx'
import { LearningProvider } from './context/LearningContext.jsx'

// HashRouter: aplikasi tetap jalan di hosting statis mana pun tanpa pengaturan server.
// VITE_ROUTER=memory: untuk tempat yang tidak mengizinkan alamat #/halaman (mis. halaman tersemat).
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : HashRouter
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <LearningProvider>
        <App />
      </LearningProvider>
    </Router>
  </React.StrictMode>,
)
