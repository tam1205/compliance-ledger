import { useState } from 'react'
import styles from './AddModal.module.css'

const DEFAULTS = { entity: '', amount: '', currency: 'GBP', type: 'Wire Transfer', risk: 'low', rule: '' }

export default function AddModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState(DEFAULTS)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.entity.trim() || !form.amount) {
      setError('Entity and amount are required.')
      return
    }
    setError('')
    await onSubmit({ ...form, amount: parseFloat(form.amount) })
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Log transaction</h2>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.row}>
          <label>Entity</label>
          <input type="text" value={form.entity} onChange={e => set('entity', e.target.value)} placeholder="Company name" />
        </div>
        <div className={styles.row}>
          <label>Amount</label>
          <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" />
        </div>
        <div className={styles.row}>
          <label>Currency</label>
          <select value={form.currency} onChange={e => set('currency', e.target.value)}>
            {['GBP','USD','EUR'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.row}>
          <label>Type</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            {['Wire Transfer','ACH','CHAPS','SWIFT'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className={styles.row}>
          <label>Risk level</label>
          <select value={form.risk} onChange={e => set('risk', e.target.value)}>
            {['low','medium','high'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className={styles.row}>
          <label>Rule triggered</label>
          <input type="text" value={form.rule} onChange={e => set('rule', e.target.value)} placeholder="— if none" />
        </div>

        <div className={styles.btns}>
          <button className={styles.cancel} onClick={onClose}>Cancel</button>
          <button className={styles.submit} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}
