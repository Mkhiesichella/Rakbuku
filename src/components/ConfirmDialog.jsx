import { useState } from 'react'

export default function ConfirmDialog({ title, message, confirmLabel = 'Hapus', onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false)
  const go = async () => {
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="cd-title" onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-card p-5">
        <h3 id="cd-title" className="font-display text-xl font-bold">{title}</h3>
        <p className="mt-2 text-mute">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} disabled={busy} className="rounded-lg border border-line px-4 py-2 font-medium">Batal</button>
          <button onClick={go} disabled={busy} className="rounded-lg bg-danger px-4 py-2 font-semibold text-white disabled:opacity-60">
            {busy ? 'Memproses…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
