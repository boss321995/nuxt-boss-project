// ~/plugins/vue3-easy-data-table.client.ts
import { defineNuxtPlugin } from '#app'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  // ลงทะเบียน component ชื่อ <EasyDataTable>
  nuxtApp.vueApp.component('EasyDataTable', Vue3EasyDataTable)
})