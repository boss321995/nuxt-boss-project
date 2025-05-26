// nuxt.config.ts
import { config as loadEnv } from 'dotenv'
import { defineNuxtConfig } from 'nuxt/config'

loadEnv()

export default defineNuxtConfig({
  // 1) Compatibility date
  compatibilityDate: '2025-05-26',

  // 2) Modules — ต้องมี Tailwind module
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // 3) CSS global — ต้องชี้ไปที่ไฟล์ Tailwind entry
  css: [
    '@/assets/css/tailwind.css'
  ],

  // 4) PostCSS plugins (แทน postcss.config.js)
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  runtimeConfig: {
    dbHost:     process.env.DB_HOST,
    dbUser:     process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName:     process.env.DB_NAME,
    jwtSecret:  process.env.JWT_SECRET
  },
  devtools: { enabled: true }
})
