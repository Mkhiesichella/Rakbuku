import { Star } from 'lucide-react'

export function StarsDisplay({ value = 0, size = 14 }) {
  if (!value) return null
  return (
    <span className="inline-flex gap-0.5" aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= value ? 'fill-want text-want' : 'text-line'} />
      ))}
    </span>
  )
}

export function StarsInput({ value, onChange }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} bintang`}
          onClick={() => onChange(value === n ? 0 : n)}
          className="p-1 rounded"
        >
          <Star size={24} className={n <= value ? 'fill-want text-want' : 'text-line'} />
        </button>
      ))}
    </div>
  )
}
