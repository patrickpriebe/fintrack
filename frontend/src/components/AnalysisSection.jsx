import { formatCurrency } from '../utils.js'

export function AnalysisSection({ dashboard, loading }) {
  const income = Number(dashboard.income || 0)
  const expense = Number(dashboard.expense || 0)
  const categories = dashboard.expenses_by_category || []
  const flowMax = Math.max(income, expense, 1)
  const categoryMax = Math.max(...categories.map((item) => Number(item.total)), 1)

  return (
    <section className="panel analysis-panel" aria-busy={loading}>
      <div className="panel-heading analysis-heading">
        <div>
          <span className="eyebrow">ANÁLISE DO MÊS</span>
          <h2>Seu mês em perspectiva</h2>
        </div>
        <span className="analysis-caption">Valores do período selecionado</span>
      </div>

      <div className="analysis-grid">
        <article className="chart-card">
          <div className="chart-heading">
            <div>
              <h3>Fluxo financeiro</h3>
              <p>Comparativo entre entradas e saídas</p>
            </div>
          </div>

          <div className="flow-chart">
            <div className="flow-column">
              <strong>{formatCurrency(income)}</strong>
              <div className="flow-track" aria-label={`Receitas: ${formatCurrency(income)}`}>
                <span className="flow-fill income" style={{ height: `${(income / flowMax) * 100}%` }} />
              </div>
              <small>Receitas</small>
            </div>
            <div className="flow-column">
              <strong>{formatCurrency(expense)}</strong>
              <div className="flow-track" aria-label={`Despesas: ${formatCurrency(expense)}`}>
                <span className="flow-fill expense" style={{ height: `${(expense / flowMax) * 100}%` }} />
              </div>
              <small>Despesas</small>
            </div>
          </div>
        </article>

        <article className="chart-card">
          <div className="chart-heading">
            <div>
              <h3>Gastos por categoria</h3>
              <p>Onde suas despesas estão concentradas</p>
            </div>
          </div>

          {loading ? (
            <p className="chart-empty">Atualizando análise…</p>
          ) : categories.length === 0 ? (
            <p className="chart-empty">Adicione despesas para visualizar a distribuição por categoria.</p>
          ) : (
            <div className="category-chart">
              {categories.map((item) => (
                <div className="category-row" key={item.category}>
                  <div className="category-label">
                    <strong>{item.category}</strong>
                    <span>{formatCurrency(item.total)}</span>
                  </div>
                  <div className="category-track" aria-label={`${item.category}: ${formatCurrency(item.total)}`}>
                    <span style={{ width: `${(Number(item.total) / categoryMax) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
