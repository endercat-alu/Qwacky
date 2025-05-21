import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { AppProvider } from './context/AppContext'
import { PermissionProvider } from './context/PermissionContext'
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

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.surface};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
    
    &:hover {
      background: ${props => `${props.theme.primary}80`};
    }
  }
`

const container = document.getElementById('root')
if (!container) {
  throw new Error('Failed to find the root element')
}

createRoot(container).render(
  <React.StrictMode>
    <AppProvider>
      <PermissionProvider>
        <ThemeProvider theme={theme.dark}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </PermissionProvider>
    </AppProvider>
  </React.StrictMode>
)