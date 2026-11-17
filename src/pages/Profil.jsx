import { useState } from 'react'
import { Check, Save, UserRound } from 'lucide-react'
import { DEFAULT_PROFILE, PROFILE_KEY } from '../config/profile'

const load = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export default function Profil() {
  const [profile, setProfile] = useState(load)
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)

  const save = (e) => {
    e.preventDefault()
    const next = {
      nama: draft.nama.trim() || DEFAULT_PROFILE.nama,
      nim: draft.nim.trim() || DEFAULT_PROFILE.nim,
      kelompok: draft.kelompok.trim() || DEFAULT_PROFILE.kelompok,
    }
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)) } catch { /* abaikan */ }
    setProfile(next)
    setDraft(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const input = 'w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base'
  const rows = [['Nama', profile.nama], ['NIM', profile.nim], ['Kelompok', profile.kelompok]]

  return (
    <>
      <h1 className="font-display text-4xl font-bold leading-tight">Profil</h1>
      <p className="mt-1 text-mute">Identitas pembuat aplikasi.</p>

      <section className="mt-6 rounded-xl border border-line bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-plum text-white">
            <UserRound size={30} />
          </div>
          <h2 className="font-display text-2xl font-bold break-words">{profile.nama}</h2>
        </div>
        <dl className="mt-5 divide-y divide-line">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3">
              <dt className="text-mute">{k}</dt>
              <dd className="font-semibold text-right break-all">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <form onSubmit={save} className="mt-4 flex flex-col gap-4 rounded-xl border border-line bg-card p-5">
        <h2 className="font-display text-xl font-bold">Ubah data</h2>
        <label className="flex flex-col gap-1 text-sm font-medium">Nama
          <input className={input} value={draft.nama} onChange={(e) => setDraft({ ...draft, nama: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">NIM
          <input className={input} inputMode="numeric" value={draft.nim} onChange={(e) => setDraft({ ...draft, nim: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">Kelompok
          <input className={input} value={draft.kelompok} onChange={(e) => setDraft({ ...draft, kelompok: e.target.value })} />
        </label>
        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-plum px-4 py-2.5 font-semibold text-white">
            <Save size={16} /> Simpan
          </button>
          {saved && <span role="status" className="inline-flex items-center gap-1 text-done"><Check size={16} /> Tersimpan</span>}
        </div>
      </form>
    </>
  )
}
