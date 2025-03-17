import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

const copyManifest = () => {
  return {
    name: 'copy-manifest',
    writeBundle: () => {
      mkdirSync('dist', { recursive: true })
      mkdirSync('dist/icons', { recursive: true })

      const manifestFile = process.env.BROWSER === 'firefox' ? 'manifest.firefox.json' : 'manifest.chrome.json'

      copyFileSync(manifestFile, 'dist/manifest.json')

      const iconSizes = ['16', '48', '128']
      iconSizes.forEach(size => {
        copyFileSync(
          `src/icons/qwacky-${size}.png`, 
          `dist/icons/qwacky-${size}.png`
        )
      })

      copyFileSync('src/icons/qwacky.png', 'dist/icons/qwacky.png')
      
      if (process.env.BROWSER === 'firefox') {
        copyFileSync('node_modules/webextension-polyfill/dist/browser-polyfill.js', 'dist/browser-polyfill.js')
      }

      copyFileSync('CHANGELOG.md', 'dist/CHANGELOG.md')
    }
  }
}

export default defineConfig(({ mode }) => {
  process.env.BROWSER = mode === 'firefox' ? 'firefox' : 'chrome'
  
  return {
    plugins: [react(), copyManifest()],
    define: {
      'process.env.BROWSER': JSON.stringify(process.env.BROWSER)
    },
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
          format: 'esm',
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
  }
})