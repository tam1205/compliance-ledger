import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function getDB() {
  return new Database(path.join(__dirname, '..', 'database.db'))
}
