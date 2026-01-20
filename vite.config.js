import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// Plugin to copy .well-known folder (Vite ignores dotfiles by default)
const copyWellKnownPlugin = () => ({
  name: 'copy-well-known',
  closeBundle() {
    const src = resolve(__dirname, 'public/.well-known/farcaster.json')
    const dest = resolve(__dirname, 'dist/.well-known')
    mkdirSync(dest, { recursive: true })
    copyFileSync(src, resolve(dest, 'farcaster.json'))
    console.log('✅ Copied .well-known/farcaster.json to dist/')
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyWellKnownPlugin()],
  base: '/StillBASING/',
})
