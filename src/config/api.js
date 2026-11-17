import axios from 'axios'

// Opsional: isi lewat .env untuk memakai Supabase sendiri.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''

export const IS_SUPABASE = Boolean(BASE_URL && SUPABASE_KEY)

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  if (IS_SUPABASE) {
    config.headers['apikey'] = SUPABASE_KEY
    config.headers['Authorization'] = `Bearer ${SUPABASE_KEY}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    let message = 'Terjadi kesalahan tak terduga.'
    if (err.response) {
      const d = err.response.data
      message = d?.message || d?.msg || d?.error || `Server error (${err.response.status})`
    } else if (err.request) {
      message = 'Server tidak dapat dijangkau. Periksa koneksi internetmu.'
    } else if (err.message) {
      message = err.message
    }
    return Promise.reject({ message, status: err.response?.status ?? null })
  },
)
