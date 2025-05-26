/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // ให้สแกน .vue / .js / .ts ทุกที่ที่เราเขียนโค้ด
    './app.vue',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './server/**/*.{js,ts}'
  ],
  theme: {
    extend: {
       colors: {
        'soft-gray': '#F5F5F5',     // เทาอ่อน
        'mid-gray':  '#D1D5DB',     // เทากลาง
        'soft-yellow':'#FEF9C3',    // เหลืองอ่อน
        'mid-yellow':'#FCD34D',     // เหลืองกลาง
        'deep-yellow':'#FBBF24',    // เหลืองเข้ม
      }
    }
  },
  plugins: []
}
