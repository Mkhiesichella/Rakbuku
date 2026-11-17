import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Download, WifiOff, CheckCircle2, X } from 'lucide-react'

export default function PWABadge() {
  const [installEvt, setInstallEvt] = useState(null)
  const [offline, setOffline] = useState(!navigator.onLine)
  const [hideReady, setHideReady] = useState(false)
  const {
    offlineReady: [offlineReady, setOfflineReady],
  } = useRegisterSW({ immediate: true })

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setInstallEvt(e) }
    const onInstalled = () => setInstallEvt(null)
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  const install = async () => {
    if (!installEvt) return
    installEvt.prompt()
    await installEvt.userChoice
    setInstallEvt(null)
  }

  const box = 'fixed left-3 right-3 sm:left-auto sm:right-4 sm:max-w-sm bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-4 z-30 flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 shadow-lg text-sm'

  if (offline)
    return (
      <div role="status" className={box}>
        <WifiOff size={18} className="text-want shrink-0" />
        <span>Kamu sedang offline. Aplikasi tetap bisa dipakai.</span>
      </div>
    )
  if (installEvt)
    return (
      <div className={box}>
        <Download size={18} className="text-plum shrink-0" />
        <span className="flex-1">Pasang <b>Rak Baca</b> di perangkatmu.</span>
        <button onClick={install} className="rounded-lg bg-plum px-3 py-1.5 font-semibold text-white">Pasang</button>
        <button onClick={() => setInstallEvt(null)} aria-label="Tutup" className="p-1"><X size={16} /></button>
      </div>
    )
  if (offlineReady && !hideReady)
    return (
      <div role="status" className={box}>
        <CheckCircle2 size={18} className="text-done shrink-0" />
        <span className="flex-1">Siap dipakai offline.</span>
        <button onClick={() => { setHideReady(true); setOfflineReady(false) }} aria-label="Tutup" className="p-1"><X size={16} /></button>
      </div>
    )
  return null
}
