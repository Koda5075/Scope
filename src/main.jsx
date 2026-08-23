import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PublicProfilePage from './pages/PublicProfilePage.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

const publicProfileMatch = window.location.pathname.match(/^\/u\/([^/]+)\/?$/)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      {publicProfileMatch ? <PublicProfilePage slug={decodeURIComponent(publicProfileMatch[1])} /> : <App />}
    </ErrorBoundary>
  </React.StrictMode>,
)
