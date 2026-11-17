import { STATUS, STATUS_KEYS } from '../constants'
import { StarsDisplay } from '../components/Stars'

export default function Statistik({ data }) {
  const { books } = data
  const total = books.length
  const count = (k) => books.filter((b) => b.status === k).length
  const rated = books.filter((b) => b.rating > 0)
  const avg = rated.length ? rated.reduce((s, b) => s + b.rating, 0) / rated.length : 0
  const top = [...rated].sort((a, b) => b.rating - a.rating).slice(0, 3)
  const doneRatio = total ? Math.round((count('done') / total) * 100) : 0

  return (
    <>
      <h1 className="font-display text-4xl font-bold leading-tight">Statistik</h1>
      <p className="mt-1 text-mute">Ringkasan dari semua buku di rakmu.</p>

      {total === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-line py-12 text-center text-mute">
          Belum ada data. Tambahkan buku di halaman Rak.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <section className="rounded-xl border border-line bg-card p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-bold">Sebaran status</h2>
              <span className="text-sm text-mute">{doneRatio}% selesai dibaca</span>
            </div>
            <div className="mt-4 flex h-10 overflow-hidden rounded-lg" role="img" aria-label="Diagram sebaran status buku">
              {STATUS_KEYS.map((k) => {
                const n = count(k)
                return n ? <div key={k} className={STATUS[k].color} style={{ width: `${(n / total) * 100}%` }} /> : null
              })}
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              {STATUS_KEYS.map((k) => (
                <li key={k} className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-sm ${STATUS[k].color}`} aria-hidden="true" />
                  <span className="text-mute">{STATUS[k].label}</span>
                  <b className="ml-auto sm:ml-1">{count(k)}</b>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-line bg-card p-5">
            <h2 className="font-display text-xl font-bold">Penilaian</h2>
            {rated.length === 0 ? (
              <p className="mt-2 text-mute">Belum ada buku yang diberi rating.</p>
            ) : (
              <>
                <p className="mt-2">
                  Rata-rata <b>{avg.toFixed(1)}</b> dari 5, dari {rated.length} buku.
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {top.map((b) => (
                    <li key={b.id} className="flex items-center justify-between gap-3 border-t border-line pt-2">
                      <span className="min-w-0 truncate font-medium">{b.title}</span>
                      <StarsDisplay value={b.rating} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      )}
    </>
  )
}
