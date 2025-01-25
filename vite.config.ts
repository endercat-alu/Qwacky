import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { writeFileSync, copyFileSync, mkdirSync } from 'fs'

// Plugin to copy manifest and icons
const copyManifest = () => {
  return {
    name: 'copy-manifest',
    writeBundle: () => {
      // Ensure dist directory exists
      mkdirSync('dist', { recursive: true })
      mkdirSync('dist/icons', { recursive: true })
      
      // Copy manifest
      copyFileSync('manifest.json', 'dist/manifest.json')
      
      // Copy icon
      copyFileSync('public/icons/icon.svg', 'dist/icons/icon.svg')
      copyFileSync('src/icons/qwacky.png', 'dist/icons/qwacky.png')
    }
  }
}

export default defineConfig({
  plugins: [react(), copyManifest()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.ts'),
        contentScript: resolve(__dirname, 'src/contentScript.ts')
      },
      output: {
        entryFileNames: chunk => {
          if (chunk.name === 'background' || chunk.name === 'contentScript') {
            return '[name].js'
          }
          return 'assets/[name].[hash].js'
        },
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})