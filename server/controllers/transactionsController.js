import { getDB } from '../db/db.js'

export function getAllTransactions(req, res) {
  const db = getDB()
  try {
    const { status, risk, search } = req.query
    let query = 'SELECT * FROM transactions WHERE 1=1'
    const params = []

    if (status && status !== 'all') { query += ' AND status = ?'; params.push(status) }
    if (risk   && risk   !== 'all') { query += ' AND risk = ?';   params.push(risk)   }
    if (search) {
      query += ' AND (entity LIKE ? OR txn_id LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    query += ' ORDER BY ts DESC'
    const rows = db.prepare(query).all(...params)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  } finally {
    db.close()
  }
}

export function createTransaction(req, res) {
  const db = getDB()
  try {
    const { entity, amount, currency, type, risk, rule } = req.body
    if (!entity || !amount || !currency || !type || !risk) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const statusMap = { low: 'cleared', medium: 'review', high: 'flagged' }
    const status = statusMap[risk] || 'pending'

    const last = db.prepare('SELECT txn_id FROM transactions ORDER BY id DESC LIMIT 1').get()
    const lastNum = last ? parseInt(last.txn_id.split('-')[1]) : 40
    const txn_id = `TXN-${String(lastNum + 1).padStart(4, '0')}`
    const ts = new Date().toISOString().slice(0, 16).replace('T', ' ')

    db.prepare(
      'INSERT INTO transactions (txn_id, ts, entity, amount, currency, type, risk, status, rule) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(txn_id, ts, entity, parseFloat(amount), currency, type, risk, status, rule || '-')

    const created = db.prepare('SELECT * FROM transactions WHERE txn_id = ?').get(txn_id)
    res.status(201).json(created)
  } catch (err) {
    res.status(500).json({ error: err.message })
  } finally {
    db.close()
  }
}

export function updateTransactionStatus(req, res) {
  const db = getDB()
  try {
    const { id } = req.params
    const { status } = req.body
    const valid = ['flagged', 'review', 'cleared', 'pending']
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' })

    db.prepare('UPDATE transactions SET status = ? WHERE txn_id = ?').run(status, id)
    const updated = db.prepare('SELECT * FROM transactions WHERE txn_id = ?').get(id)
    if (!updated) return res.status(404).json({ error: 'Transaction not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  } finally {
    db.close()
  }
}
