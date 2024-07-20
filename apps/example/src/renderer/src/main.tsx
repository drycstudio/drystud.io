import './assets/main.css'
import electronLogo from './assets/electron.svg'

import React from 'react'
import ReactDOM from 'react-dom/client'
import Titlebar from 'lib'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Titlebar title="Titlebar Title Example" logo={electronLogo} />
    <App />
  </React.StrictMode>
)
