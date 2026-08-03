const API_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const validationMessage = body.errors
      ? Object.values(body.errors).flat().join(' ')
      : null
    throw new Error(validationMessage || body.message || 'Não foi possível concluir a operação.')
  }

  return response.status === 204 ? null : response.json()
}

export const financeApi = {
  dashboard: (month) => request(`/dashboard?month=${month}`),
  transactions: (month) => request(`/transactions?month=${month}`),
  create: (payload) => request('/transactions', { method: 'POST', body: JSON.stringify(payload) }),
  remove: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
}

