import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { mdxPlus } from 'vite-plugin-mdx-plus'
import { resolve } from 'node:path'

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
    tailwindcss()
  ],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }]
  }
})
