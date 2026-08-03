import { describe, expect, it } from 'vitest'
import { formatCurrency } from '../src/utils.js'

describe('formatCurrency', () => {
  it('formata valores em reais', () => {
    const formatted = formatCurrency(1234.5)

    expect(formatted).toContain('1.234,50')
    expect(formatted).toContain('R$')
  })
})

