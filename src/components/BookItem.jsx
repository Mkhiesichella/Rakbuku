import { Pencil, Trash2 } from 'lucide-react'
import { STATUS } from '../constants'
import { StarsDisplay } from './Stars'

export default function BookItem({ book, onEdit, onDelete }) {
  const st = STATUS[book.status] || STATUS.want
  return (
    <li className="flex overflow-hidden rounded-xl border border-line bg-card">
      <div className={`w-2.5 shrink-0 ${st.color}`} aria-hidden="true" />
      <div className="min-w-0 flex-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold leading-snug break-words">{book.title}</h3>
            {book.author && <p className="text-sm text-mute">{book.author}</p>}
          </div>
          <div className="flex shrink-0 gap-1">
            <button onClick={() => onEdit(book)} aria-label={`Ubah ${book.title}`} className="rounded-lg p-2 text-mute hover:bg-paper hover:text-ink">
              <Pencil size={17} />
            </button>
            <button onClick={() => onDelete(book)} aria-label={`Hapus ${book.title}`} className="rounded-lg p-2 text-mute hover:bg-danger/10 hover:text-danger">
              <Trash2 size={17} />
            </button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className={`text-sm font-semibold ${st.text}`}>{st.label}</span>
          <StarsDisplay value={book.rating} />
        </div>
        {book.notes && <p className="mt-2 text-sm text-ink/80 whitespace-pre-line line-clamp-3">{book.notes}</p>}
      </div>
    </li>
  )
}
