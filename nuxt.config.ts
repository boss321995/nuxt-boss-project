export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  // ไม่ต้องใส่ css: หรือ postcss: เพิ่มอีก
   runtimeConfig: {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    jwtSecret: process.env.JWT_SECRET      // กรณีใช้ JWT
  },
  devtools: { enabled: true }
})
