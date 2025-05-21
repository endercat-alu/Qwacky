import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    primary: string
    error: string
    success: string
    background: string
    surface: string
    text: string
    textSecondary: string
    textTertiary: string
    border: string
    hover: string
    inputBackground: string
  }
}

export const theme = {
  light: {
    primary: '#ff9f19',
    error: '#dc3545',
    success: '#198754',
    background: '#FFFFFF',
    surface: '#F7F7F7',
    text: '#222222',
    textSecondary: '#555555',
    textTertiary: '#888888',
    border: '#E6E6E6',
    hover: '#F0F0F0',
    inputBackground: '#FFFFFF'
  },
  dark: {
    primary: '#ff9f19',
    error: '#dc3545',
    success: '#198754',
    background: '#1C1C1C',
    surface: '#2D2D2D',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    textTertiary: '#888888',
    border: '#3D3D3D',
    hover: '#333333',
    inputBackground: '#2D2D2D'
  }
}