import { useState, useEffect } from 'react'

const read = () => window.location.hash.replace(/^#\/?/, '') || 'rak'

// Router sederhana berbasis hash: aman untuk refresh di Vercel tanpa rewrite.
export function useHashRoute() {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
