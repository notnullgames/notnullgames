import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { mdxPlus } from 'vite-plugin-mdx-plus'
import { resolve } from 'node:path'
import { null0Data } from './vite-plugin-null0.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mdxPlus({
      shiki: {
        themes: {
          dark: 'vitesse-dark',
          light: 'vitesse-dark'
        }
      }
    }),
    react({ include: /\.([tj]s|md)x?$/ }),
    tailwindcss(),
    null0Data()
  ],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }]
  }
})
