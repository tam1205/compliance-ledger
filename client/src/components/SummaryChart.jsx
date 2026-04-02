import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'
import styles from './SummaryChart.module.css'

export default function SummaryChart({ rows }) {
  const ref = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    if (chartRef.current) chartRef.current.destroy()

    const counts = { flagged: 0, review: 0, cleared: 0, pending: 0 }
    rows.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++ })

    chartRef.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: ['Flagged', 'In review', 'Cleared', 'Pending'],
        datasets: [{
          data: [counts.flagged, counts.review, counts.cleared, counts.pending],
          backgroundColor: ['#F09595', '#FAC775', '#97C459', '#B4B2A9'],
          borderRadius: 3,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Courier New', size: 10 }, color: '#888780' } },
          y: { grid: { color: 'rgba(136,135,128,0.15)' }, ticks: { font: { family: 'Courier New', size: 10 }, color: '#888780', stepSize: 1 }, border: { display: false } }
        }
      }
    })

    return () => chartRef.current?.destroy()
  }, [rows])

  return (
    <div className={styles.wrap}>
      <p className={styles.title}>Transaction status breakdown</p>
      <div className={styles.canvas}>
        <canvas ref={ref} />
      </div>
    </div>
  )
}
