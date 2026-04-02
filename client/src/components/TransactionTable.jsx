import styles from './TransactionTable.module.css'

const fmtAmt = (n, cur) => {
  const sym = { GBP: '£', EUR: '€', USD: '$' }[cur] || ''
  return sym + Number(n).toLocaleString()
}

function RiskBadge({ risk }) {
  return <span className={`${styles.badge} ${styles[risk]}`}>{risk}</span>
}

function StatusCell({ status }) {
  const dotClass = {
    flagged: styles.dotFlagged,
    review: styles.dotReview,
    cleared: styles.dotCleared,
    pending: styles.dotPending,
  }[status] || ''

  return (
    <span className={styles.statusCell}>
      <span className={`${styles.dot} ${dotClass}`} />
      {status}
    </span>
  )
}

export default function TransactionTable({ rows }) {
  if (rows.length === 0) {
    return <p className={styles.empty}>No transactions match the current filters.</p>
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {['ID', 'Timestamp', 'Entity', 'Amount', 'Type', 'Risk', 'Status', 'Rule'].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.txn_id || r.id}>
              <td className={styles.mono} style={{ color: '#888780', fontSize: '11px' }}>{r.txn_id}</td>
              <td className={styles.mono} style={{ fontSize: '11px' }}>{r.ts}</td>
              <td>{r.entity}</td>
              <td className={styles.mono} style={{ textAlign: 'right' }}>{fmtAmt(r.amount, r.currency)}</td>
              <td style={{ color: '#5f5e5a', fontSize: '12px' }}>{r.type}</td>
              <td><RiskBadge risk={r.risk} /></td>
              <td><StatusCell status={r.status} /></td>
              <td className={styles.mono} style={{ color: '#888780', fontSize: '11px' }}>{r.rule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
