const BASE = import.meta.env.VITE_API_URL || '/api'

export async function fetchTransactions(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters.risk && filters.risk !== 'all') params.set('risk', filters.risk)
  if (filters.search) params.set('search', filters.search)

  const res = await fetch(`${BASE}/transactions?${params}`)
  if (!res.ok) throw new Error('Failed to fetch transactions')
  return res.json()
}

export async function createTransaction(data) {
  const res = await fetch(`${BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to create transaction')
  return res.json()
}

export async function updateStatus(txnId, status) {
  const res = await fetch(`${BASE}/transactions/${txnId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error('Failed to update status')
  return res.json()
}
