// Keeps a language selection in the URL hash, so /null0/api#zig and
// /null0/gallery#zig both arrive pre-filtered and stay shareable as you switch.

import { useState, useEffect } from 'react'
import { api } from '@/null0'

export default function useLanguageHash() {
  const [langId, langIdSet] = useState('')

  useEffect(() => {
    // These pages also use the hash for ordinary anchors (#draw_circle on the
    // API page), so only a hash that names a language is treated as one -
    // anything else is left alone to scroll as normal.
    const fromHash = () => {
      const hash = decodeURIComponent(location.hash.replace(/^#/, ''))
      if (hash in api.languages) {
        langIdSet(hash)
      }
    }
    fromHash()
    addEventListener('hashchange', fromHash)
    return () => removeEventListener('hashchange', fromHash)
  }, [])

  // replaceState rather than assigning location.hash: no history entry per
  // pick, and no scroll jump.
  const pick = (id) => {
    langIdSet(id)
    history.replaceState(null, '', id ? `#${id}` : location.pathname + location.search)
  }

  return [langId, pick]
}
