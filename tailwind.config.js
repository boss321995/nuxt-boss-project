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
    extend: {}
  },
  plugins: []
}
