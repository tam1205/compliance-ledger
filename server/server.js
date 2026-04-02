import express from 'express'
import cors from 'cors'
import { getDB } from './db/db.js'
import { seedIfEmpty } from './db/seed.js'
import transactionRoutes from './routes/transactions.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
}))
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/transactions', transactionRoutes)

function start() {
  const db = getDB()
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      txn_id    TEXT NOT NULL UNIQUE,
      ts        TEXT NOT NULL,
      entity    TEXT NOT NULL,
      amount    REAL NOT NULL,
      currency  TEXT NOT NULL DEFAULT 'GBP',
      type      TEXT NOT NULL,
      risk      TEXT NOT NULL CHECK(risk IN ('low','medium','high')),
      status    TEXT NOT NULL CHECK(status IN ('flagged','review','cleared','pending')),
      rule      TEXT NOT NULL DEFAULT '-'
    )
  `)
  db.close()
  seedIfEmpty()
  app.listen(PORT, () => console.log(`API running on port ${PORT}`))
}

start()
