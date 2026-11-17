import { useMemo, useState } from 'react'
import { Plus, Search, Loader2, AlertCircle, BookOpen, RefreshCw } from 'lucide-react'
import { STATUS, STATUS_KEYS } from '../constants'
import { IS_SUPABASE } from '../config/api'
import BookItem from '../components/BookItem'
import BookForm from '../components/BookForm'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Rak({ data }) {
  const { books, loading, error, source, refetch, addBook, updateBook, deleteBook } = data
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(null) // null | {} (baru) | book (ubah)
  const [toDelete, setToDelete] = useState(null)
  const [actionError, setActionError] = useState('')

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return books.filter(
      (b) =>
        (filter === 'all' || b.status === filter) &&
        (!q || b.title.toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q)),
    )
  }, [books, query, filter])

  const handleSubmit = (d) => (form?.id ? updateBook(form.id, d) : addBook(d))

  const confirmDelete = async () => {
    try {
      await deleteBook(toDelete.id)
      setToDelete(null)
      setActionError('')
    } catch (err) {
      setToDelete(null)
      setActionError(err.message || 'Gagal menghapus.')
    }
  }

  const pill = (active) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap ${
      active ? 'border-plum bg-plum text-white' : 'border-line bg-card text-mute'
    }`

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight">Rak bacaanmu</h1>
          <p className="mt-1 text-mute">
            {books.length} buku tercatat
            {!IS_SUPABASE && ' · tersimpan di perangkat ini'}
          </p>
        </div>
        <button onClick={() => setForm({})} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-plum px-4 py-2.5 font-semibold text-white">
          <Plus size={18} /> <span className="hidden sm:inline">Tambah buku</span><span className="sm:hidden">Tambah</span>
        </button>
      </div>

      <div className="relative mt-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul atau penulis"
          aria-label="Cari buku"
          className="w-full rounded-lg border border-line bg-white py-2.5 pl-10 pr-3 text-base"
        />
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button className={pill(filter === 'all')} onClick={() => setFilter('all')}>Semua</button>
        {STATUS_KEYS.map((k) => (
          <button key={k} className={pill(filter === k)} onClick={() => setFilter(k)}>{STATUS[k].label}</button>
        ))}
      </div>

      {source === 'cache' && (
        <p role="status" className="mt-4 rounded-lg bg-want/10 px-3 py-2 text-sm">
          Server tidak terjangkau. Menampilkan salinan terakhir yang tersimpan.
        </p>
      )}
      {actionError && (
        <p role="alert" className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{actionError}</p>
      )}

      <div className="mt-5">
        {loading && books.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-mute">
            <Loader2 className="animate-spin" /> Memuat buku…
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-danger/30 bg-card py-12 text-center text-danger">
            <AlertCircle />
            <p>{error}</p>
            <button onClick={refetch} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-ink">
              <RefreshCw size={16} /> Coba lagi
            </button>
          </div>
        ) : shown.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line py-14 text-center">
            <BookOpen className="text-mute" />
            <p className="text-mute">{books.length === 0 ? 'Rakmu masih kosong.' : 'Tidak ada buku yang cocok.'}</p>
            {books.length === 0 && (
              <button onClick={() => setForm({})} className="rounded-lg bg-plum px-4 py-2 font-semibold text-white">Tambah buku pertama</button>
            )}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {shown.map((b) => (
              <BookItem key={b.id} book={b} onEdit={setForm} onDelete={setToDelete} />
            ))}
          </ul>
        )}
      </div>

      {form && (
        <BookForm book={form.id ? form : null} onSubmit={handleSubmit} onClose={() => setForm(null)} />
      )}
      {toDelete && (
        <ConfirmDialog
          title="Hapus buku?"
          message={`"${toDelete.title}" akan dihapus dari rakmu dan tidak bisa dikembalikan.`}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  )
}
