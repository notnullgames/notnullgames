// Shared language selector. A <select> rather than a row of tabs: 23 of them
// do not fit on one line, and this works on a phone.

import { languages } from '@/null0'

export default function LanguagePicker({ value, onChange, emptyLabel, label = 'language' }) {
  return (
    <label className='not-prose flex items-center gap-2 my-4'>
      <span className='text-sm'>{label}:</span>
      <select className='select select-bordered select-sm' value={value} onChange={(e) => onChange(e.target.value)}>
        {emptyLabel && <option value=''>{emptyLabel}</option>}
        {languages.map((l) => (
          <option key={l.id} value={l.id}>
            {l.title}
          </option>
        ))}
      </select>
    </label>
  )
}
