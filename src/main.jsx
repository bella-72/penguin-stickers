import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import ReactPixel from 'react-facebook-pixel'

// Initialize Meta Pixel
ReactPixel.init('1230623762470783')
ReactPixel.pageView()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)