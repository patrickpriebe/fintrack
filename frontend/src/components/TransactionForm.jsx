import { useState } from 'react'
import { CalendarPicker } from './CalendarPicker.jsx'

const initialForm = {
  type: 'expense',
  category: 'Alimentação',
  description: '',
  amount: '',
  occurred_on: new Date().toISOString().slice(0, 10),
}

export function TransactionForm({ onSubmit, busy }) {
  const [form, setForm] = useState(initialForm)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    await onSubmit({ ...form, amount: Number(form.amount) })
    setForm((current) => ({ ...initialForm, type: current.type, occurred_on: current.occurred_on }))
  }

  return (
    <form className="transaction-form" onSubmit={submit}>
      <div className="form-heading">
        <div>
          <span className="eyebrow">NOVO LANÇAMENTO</span>
          <h2>Registre um movimento</h2>
        </div>
        <div className="segmented" aria-label="Tipo do lançamento">
          <button
            className={form.type === 'expense' ? 'active' : ''}
            onClick={() => update('type', 'expense')}
            type="button"
          >
            Despesa
          </button>
          <button
            className={form.type === 'income' ? 'active' : ''}
            onClick={() => update('type', 'income')}
            type="button"
          >
            Receita
          </button>
        </div>
      </div>

      <label>
        Categoria
        <span className="select-control">
          <select value={form.category} onChange={(event) => update('category', event.target.value)}>
            <option>Alimentação</option>
            <option>Moradia</option>
            <option>Transporte</option>
            <option>Saúde</option>
            <option>Lazer</option>
            <option>Salário</option>
            <option>Investimentos</option>
            <option>Outros</option>
          </select>
        </span>
      </label>

      <label>
        Descrição
        <input
          value={form.description}
          onChange={(event) => update('description', event.target.value)}
          placeholder="Ex.: supermercado da semana"
        />
      </label>

      <div className="form-row">
        <label>
          Valor
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(event) => update('amount', event.target.value)}
            placeholder="0,00"
            required
          />
        </label>
        <div className="field-group">
          <span className="field-label">Data</span>
          <CalendarPicker
            value={form.occurred_on}
            onChange={(value) => update('occurred_on', value)}
            ariaLabel="Selecionar data do lançamento"
          />
        </div>
      </div>

      <button className="primary-button" disabled={busy} type="submit">
        {busy ? 'Salvando…' : 'Adicionar lançamento'}
      </button>
    </form>
  )
}
