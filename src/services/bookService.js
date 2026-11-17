import { apiClient, IS_SUPABASE } from '../config/api'

const LS_KEY = 'rakbaca_books'

const readLocal = () => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
const writeLocal = (list) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list))
  } catch {
    /* penyimpanan penuh / mode privat */
  }
}
const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const clean = (d) => ({
  title: d.title.trim(),
  author: (d.author || '').trim(),
  status: d.status || 'want',
  rating: Number(d.rating) || 0,
  notes: (d.notes || '').trim(),
})

// ---- Mode lokal: bekerja penuh offline ----
const local = {
  async list() {
    return { data: readLocal(), source: 'local' }
  },
  async create(d) {
    const item = { id: newId(), created_at: new Date().toISOString(), ...clean(d) }
    writeLocal([item, ...readLocal()])
    return item
  },
  async update(id, d) {
    const list = readLocal().map((b) => (b.id === id ? { ...b, ...clean(d) } : b))
    writeLocal(list)
    return list.find((b) => b.id === id)
  },
  async remove(id) {
    writeLocal(readLocal().filter((b) => b.id !== id))
  },
}

// ---- Mode Supabase (opsional) dengan cadangan lokal untuk baca saat offline ----
const remote = {
  async list() {
    try {
      const data = await apiClient.get('/rest/v1/books?select=*&order=created_at.desc')
      writeLocal(data)
      return { data, source: 'server' }
    } catch (err) {
      const cached = readLocal()
      if (cached.length) return { data: cached, source: 'cache' }
      throw err
    }
  },
  async create(d) {
    const res = await apiClient.post('/rest/v1/books', clean(d), {
      headers: { Prefer: 'return=representation' },
    })
    return Array.isArray(res) ? res[0] : res
  },
  async update(id, d) {
    const res = await apiClient.patch(`/rest/v1/books?id=eq.${id}`, clean(d), {
      headers: { Prefer: 'return=representation' },
    })
    return Array.isArray(res) ? res[0] : res
  },
  async remove(id) {
    await apiClient.delete(`/rest/v1/books?id=eq.${id}`)
  },
}

export const bookService = IS_SUPABASE ? remote : local
export { IS_SUPABASE }
