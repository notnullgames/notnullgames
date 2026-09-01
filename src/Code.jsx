// One highlighted code block, used everywhere the site renders code that
// doesn't come from an mdx fence (those are highlighted at build time by
// vite-plugin-mdx-plus). Same shiki theme, so a signature on the API page
// looks like a snippet in a page body.

import { codeToHtml, bundledLanguages } from 'shiki'
import { useState, useEffect } from 'react'

// Not every cart language has a shiki grammar - odin (and onyx, which borrows
// its highlighting) has none. Falling back to C still colours comments,
// strings and numbers, which is most of the value, and beats a block that
// silently renders plain while its neighbours are highlighted.
const grammar = (lang) => (lang in bundledLanguages ? lang : 'c')

export default function Code({ children, lang = 'c', className = '' }) {
  const code = String(children).replace(/\s+$/, '')
  const [html, htmlSet] = useState(null)

  useEffect(() => {
    let alive = true
    codeToHtml(code, { lang: grammar(lang), theme: 'vitesse-dark' })
      .then((h) => alive && htmlSet(h))
      // an unknown grammar shouldn't blank the block - fall through to plain
      .catch(() => alive && htmlSet(null))
    return () => {
      alive = false
    }
  }, [code, lang])

  // the plain block is what server-rendered HTML shows, and what a reader sees
  // for the instant before hydration - same padding either way, so nothing jumps
  if (!html) {
    return (
      <pre className={`overflow-x-auto ${className}`}>
        <code>{code}</code>
      </pre>
    )
  }
  return <div className={`not-prose null0-code ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
