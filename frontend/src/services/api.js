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
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!response.ok) {
    const responseText = await response.text()
    let message = responseText || 'Não foi possível concluir a solicitação'
    try {
      const body = JSON.parse(responseText)
      message = body.erro || body.message || body.detail || message
    } catch {
      // O servidor pode devolver uma mensagem em texto puro.
    }
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  return response.status === 204 ? null : response.json()
}
