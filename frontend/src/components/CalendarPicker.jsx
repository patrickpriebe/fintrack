import { useEffect, useRef, useState } from 'react'

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

function parseValue(value, mode) {
  const parts = value.split('-').map(Number)
  const [year, month, day = 1] = parts
  return year && month ? new Date(year, month - 1, mode === 'month' ? 1 : day) : new Date()
}

function toValue(date, mode) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return mode === 'month' ? `${year}-${month}` : `${year}-${month}-${day}`
}

function formatValue(value, mode) {
  const date = parseValue(value, mode)
  return new Intl.DateTimeFormat('pt-BR', mode === 'month'
    ? { month: 'long', year: 'numeric' }
    : { day: '2-digit', month: 'short', year: 'numeric' }
  ).format(date).replace(' de ', ' ')
}

export function CalendarPicker({ value, onChange, mode = 'date', ariaLabel }) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => parseValue(value, mode))
  const rootRef = useRef(null)
  const selectedDate = parseValue(value, mode)
  const today = new Date()

  useEffect(() => {
    if (!open) return undefined

    function closeOnOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  function toggle() {
    if (!open) setViewDate(parseValue(value, mode))
    setOpen((current) => !current)
  }

  function moveView(direction) {
    setViewDate((current) => mode === 'month'
      ? new Date(current.getFullYear() + direction, current.getMonth(), 1)
      : new Date(current.getFullYear(), current.getMonth() + direction, 1)
    )
  }

  function choose(date) {
    onChange(toValue(date, mode))
    setOpen(false)
  }

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
  const firstDayOffset = (new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() + 6) % 7

  return (
    <span className="calendar-picker" ref={rootRef}>
      <button
        className="picker-trigger"
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
      >
        <span>{formatValue(value, mode)}</span>
        <i aria-hidden="true">⌄</i>
      </button>

      {open && (
        <span className="calendar-popover" role="dialog" aria-label={mode === 'month' ? 'Selecionar período' : 'Selecionar data'}>
          <span className="calendar-header">
            <button type="button" onClick={() => moveView(-1)} aria-label="Anterior">←</button>
            <strong>
              {mode === 'month'
                ? viewDate.getFullYear()
                : new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(viewDate)}
            </strong>
            <button type="button" onClick={() => moveView(1)} aria-label="Próximo">→</button>
          </span>

          {mode === 'month' ? (
            <span className="month-grid">
              {monthNames.map((month, index) => {
                const selected = selectedDate.getFullYear() === viewDate.getFullYear()
                  && selectedDate.getMonth() === index
                return (
                  <button
                    className={selected ? 'selected' : ''}
                    key={month}
                    type="button"
                    onClick={() => choose(new Date(viewDate.getFullYear(), index, 1))}
                  >
                    {month}
                  </button>
                )
              })}
            </span>
          ) : (
            <>
              <span className="weekday-grid">
                {weekDays.map((day) => <small key={day}>{day}</small>)}
              </span>
              <span className="day-grid">
                {Array.from({ length: firstDayOffset }, (_, index) => <i key={`empty-${index}`} />)}
                {Array.from({ length: daysInMonth }, (_, index) => {
                  const day = index + 1
                  const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
                  const selected = toValue(date, 'date') === toValue(selectedDate, 'date')
                  const isToday = toValue(date, 'date') === toValue(today, 'date')
                  return (
                    <button
                      className={`${selected ? 'selected' : ''} ${isToday ? 'today' : ''}`.trim()}
                      key={day}
                      type="button"
                      onClick={() => choose(date)}
                    >
                      {day}
                    </button>
                  )
                })}
              </span>
            </>
          )}

          <button className="calendar-current" type="button" onClick={() => choose(today)}>
            {mode === 'month' ? 'Mês atual' : 'Hoje'}
          </button>
        </span>
      )}
    </span>
  )
}
