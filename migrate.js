// migrate.js
import fs from 'fs'
import path from 'path'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function runMigrations() {
  const {
    DB_HOST = '127.0.0.1',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_NAME = 'myapp_db'
  } = process.env

  const conn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
     multipleStatements: true
  })

  // 1) สร้างตาราง schema_migrations
  console.log('Ensuring schema_migrations table exists…')
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(50) PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 2) อ่านไฟล์ migration
  const migrationsDir = path.resolve('./migrations')
  const files = fs.readdirSync(migrationsDir)
    .filter(f => /^[0-9]{3}_.*\.sql$/.test(f))
    .sort()

  // 3) รันทีละไฟล์
  for (const file of files) {
    const version = file.slice(0, 3)
    const [rows] = await conn.query(
      'SELECT version FROM schema_migrations WHERE version = ?',
      [version]
    )
    if (rows.length === 0) {
      console.log(`Applying ${file}…`)
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      await conn.query(sql)
      await conn.query(
        'INSERT INTO schema_migrations (version) VALUES (?)',
        [version]
      )
    } else {
      console.log(`Skipping ${file}, already applied`)
    }
  }

  await conn.end()
  console.log('🎉 All migrations applied!')
}

runMigrations().catch(err => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
