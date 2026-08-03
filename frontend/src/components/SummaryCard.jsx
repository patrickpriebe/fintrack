import { formatCurrency } from '../utils.js'

export function SummaryCard({ label, value, tone, eyebrow }) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <span>{label}</span>
      <strong>{formatCurrency(value)}</strong>
      <small>{eyebrow}</small>
    </article>
  )
}

