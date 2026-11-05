const base = import.meta.env.VITE_API_URL

export const apiConfigured = Boolean(base)

export async function request(path, options = {}) {
  if (!base) {
    const error = new Error('A API não está configurada.')
    error.code = 'API_NOT_CONFIGURED'
    throw error
  }
  const response = await fetch(`${base}${path}`, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  if (!response.ok) {
    const error = new Error((await response.text()) || 'Não foi possível concluir a solicitação')
    error.status = response.status
    throw error
  }
  return response.status === 204 ? null : response.json()
}
