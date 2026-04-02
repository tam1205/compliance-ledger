import { getDB } from './db.js'

async function createTable() {
  const db = await getDB()
  try {
    await db.exec(`
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
        rule      TEXT NOT NULL DEFAULT '—'
      )
    `)
    console.log('Table created.')
  } finally {
    await db.close()
  }
}

createTable()
