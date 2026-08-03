import { useCallback, useEffect, useState } from 'react'
import { AnalysisSection } from './components/AnalysisSection.jsx'
import { CalendarPicker } from './components/CalendarPicker.jsx'
import { SummaryCard } from './components/SummaryCard.jsx'
import { TransactionForm } from './components/TransactionForm.jsx'
import { financeApi } from './services/api.js'
import { formatCurrency } from './utils.js'

const currentMonth = new Date().toISOString().slice(0, 7)
const emptyDashboard = { income: 0, expense: 0, balance: 0, expenses_by_category: [] }

function App() {
  const [month, setMonth] = useState(currentMonth)
  const [dashboard, setDashboard] = useState(emptyDashboard)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [dashboardResponse, transactionsResponse] = await Promise.all([
        financeApi.dashboard(month),
        financeApi.transactions(month),
      ])
      setDashboard(dashboardResponse.data)
      setTransactions(transactionsResponse.data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function createTransaction(payload) {
    setSaving(true)
    setError('')
    try {
      await financeApi.create(payload)
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function removeTransaction(id) {
    setError('')
    try {
      await financeApi.remove(id)
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const largestExpense = dashboard.expenses_by_category?.[0]

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="FinTrack, início">
          <span className="brand-mark">F</span>
          <span>FinTrack</span>
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div>
            <span className="eyebrow">VISÃO FINANCEIRA</span>
            <h1>Seu dinheiro,<br /><em>sem ruído.</em></h1>
            <p>Acompanhe o mês em uma visão simples.</p>
          </div>
          <div className="month-picker">
            <span>Período</span>
            <CalendarPicker value={month} onChange={setMonth} mode="month" ariaLabel="Selecionar período" />
          </div>
        </section>

        {error && <div className="error-banner" role="alert">{error}</div>}

        <section className="summary-grid" aria-busy={loading}>
          <SummaryCard label="Receitas" value={dashboard.income} tone="income" eyebrow="Entradas do mês" />
          <SummaryCard label="Despesas" value={dashboard.expense} tone="expense" eyebrow="Saídas do mês" />
          <SummaryCard label="Saldo" value={dashboard.balance} tone="balance" eyebrow="Disponível no período" />
        </section>

        <AnalysisSection dashboard={dashboard} loading={loading} />

        <section className="content-grid">
          <div className="panel transactions-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">ATIVIDADE</span>
                <h2>Últimos lançamentos</h2>
              </div>
              <span className="count-badge">{transactions.length}</span>
            </div>

            {loading ? (
              <p className="empty-state">Atualizando seus dados…</p>
            ) : transactions.length === 0 ? (
              <p className="empty-state">Nenhum lançamento neste mês. Comece pelo formulário ao lado.</p>
            ) : (
              <div className="transaction-list">
                {transactions.map((transaction) => (
                  <article className="transaction-item" key={transaction.id}>
                    <span className={`transaction-icon ${transaction.type}`}>
                      {transaction.type === 'income' ? '↙' : '↗'}
                    </span>
                    <div className="transaction-copy">
                      <strong>{transaction.description || transaction.category}</strong>
                      <span>{transaction.category} · {new Date(`${transaction.occurred_on}T12:00:00`).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <strong className={transaction.type}>
                      {transaction.type === 'income' ? '+' : '−'} {formatCurrency(transaction.amount)}
                    </strong>
                    <button className="delete-button" onClick={() => removeTransaction(transaction.id)} aria-label="Excluir lançamento">×</button>
                  </article>
                ))}
              </div>
            )}
          </div>

          <TransactionForm onSubmit={createTransaction} busy={saving} />
        </section>

        <section className="insight-bar">
          <span className="insight-icon">◎</span>
          <div>
            <span className="eyebrow">INSIGHT DO MÊS</span>
            <strong>
              {largestExpense
                ? `${largestExpense.category} lidera suas despesas com ${formatCurrency(largestExpense.total)}.`
                : 'Adicione despesas para descobrir a categoria de maior impacto.'}
            </strong>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
