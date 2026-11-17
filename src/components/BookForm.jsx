import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { STATUS, STATUS_KEYS } from '../constants'
import { StarsInput } from './Stars'

const EMPTY = { title: '', author: '', status: 'want', rating: 0, notes: '' }

export default function BookForm({ book, onSubmit, onClose }) {
  const [form, setForm] = useState(book ? { ...EMPTY, ...book } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (form.title.trim().length < 2) {
      setError('Judul minimal 2 karakter.')
      return
    }
    try {
      setSaving(true)
      setError('')
      await onSubmit(form)
      onClose()
    } catch (err) {
      setError(err.message || 'Gagal menyimpan.')
      setSaving(false)
    }
  }

  const input = 'w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base'

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-ink/50 p-0 sm:p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] flex flex-col gap-4"
        aria-labelledby="form-title"
      >
        <div className="flex items-center justify-between">
          <h2 id="form-title" className="font-display text-2xl font-bold">
            {book ? 'Ubah buku' : 'Tambah buku'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="p-2 rounded-full hover:bg-paper">
            <X size={20} />
          </button>
        </div>

        {error && <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

        <label className="flex flex-col gap-1 text-sm font-medium">
          Judul *
          <input className={input} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="mis. Laskar Pelangi" autoFocus />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Penulis
          <input className={input} value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="mis. Andrea Hirata" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Status
          <select className={input} value={form.status} onChange={(e) => set('status', e.target.value)}>
            {STATUS_KEYS.map((k) => (
              <option key={k} value={k}>{STATUS[k].label}</option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-1 text-sm font-medium">
          Rating
          <StarsInput value={form.rating} onChange={(v) => set('rating', v)} />
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Catatan
          <textarea className={input} rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Kesan, kutipan favorit, halaman terakhir…" />
        </label>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-line px-4 py-2.5 font-medium">
            Batal
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-plum px-4 py-2.5 font-semibold text-white disabled:opacity-60">
            {saving && <Loader2 size={16} className="animate-spin" />}
            {book ? 'Simpan perubahan' : 'Simpan buku'}
          </button>
        </div>
      </form>
    </div>
  )
}
