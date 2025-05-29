import { defineEventHandler, readBody, createError } from 'h3'
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const { name, quantity, category } = await readBody<{ name: string; quantity: number; category: string }>(event)

  const config = useRuntimeConfig()
  const conn = await mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
  })

  // 1️⃣ Lookup the ID of the category by its name
  const [cats] = await conn.query(
    'SELECT category_id FROM material_categories WHERE category_name = ?',
    [category]
  ) as any[]
  if (!cats.length) {
    await conn.end()
    throw createError({ statusCode: 400, statusMessage: 'Invalid category' })
  }
  const categoryId = cats[0].category_id

  // 2️⃣ Update all three fields
  await conn.execute(
    `UPDATE materials
     SET material_name = ?, quantity = ?, category_id = ?
     WHERE material_id  = ?`,
    [ name, quantity, categoryId, id ]
  )

  await conn.end()
  return { message: 'Material updated successfully' }
})
