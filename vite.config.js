import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  publicDir: '../static', // if you have a public folder
  build: {
    outDir: '../dist' // output outside src
  }
})