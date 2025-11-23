import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import yaml from 'js-yaml'

// Load config
const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
const config = yaml.load(fs.readFileSync(`./public/config.${env}.yaml`, 'utf8')) as { port?: number }

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    port: config.port || 5173,
  },
})
