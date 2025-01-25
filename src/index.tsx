import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { AppProvider } from './context/AppContext'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { theme } from './theme'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    width: 360px;
    min-height: 480px;
    overflow-x: hidden;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #2D2D2D;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #3D3D3D;
    border-radius: 4px;
    
    &:hover {
      background: rgba(222, 88, 51, 0.5);
    }
  }
`

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <AppProvider>
      <ThemeProvider theme={theme.dark}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </AppProvider>
  </React.StrictMode>
) 