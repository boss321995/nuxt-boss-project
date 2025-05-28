import mysql from 'mysql2/promise'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const { quantity } = await readBody<{ quantity: number }>(event)
  if (quantity == null) throw createError({ statusCode: 400, statusMessage: 'Missing quantity' })

  const config = useRuntimeConfig()
  const conn = await mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
  })

  // อัปเดตจำนวน
  await conn.execute(
    'UPDATE materials SET quantity = ? WHERE material_id = ?',
    [quantity, id]
  )
  await conn.end()
  return { success: true }
})