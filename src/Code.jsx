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

  // shiki hands back a whole <pre class="shiki" style="..."><code>...</code></pre>.
  // Wrapping that in a div and marking it not-prose (the obvious thing) drops
  // every bit of `.prose pre` styling - padding, margin, rounding, font-size -
  // so these blocks came out flush and slightly too big next to an mdx fence.
  // Re-emit shiki's own <pre> as this component's root instead, so it is styled
  // by exactly the same rules as a fence.
  const shiki = html && html.match(/^<pre([^>]*)>([\s\S]*)<\/pre>\s*$/)

  if (!shiki) {
    // pre-hydration, and the fallback if shiki's markup ever changes shape
    return (
      <pre className={`shiki ${className}`}>
        <code>{code}</code>
      </pre>
    )
  }

  const [, attrs, inner] = shiki
  const cls = (attrs.match(/class="([^"]*)"/) || [, ''])[1]
  const style = (attrs.match(/style="([^"]*)"/) || [, ''])[1]

  return <pre className={`${cls} ${className}`} style={parseStyle(style)} dangerouslySetInnerHTML={{ __html: inner }} />
}

// shiki writes its theme colours as an inline style string; React wants an object
function parseStyle(css) {
  const out = {}
  for (const rule of css.split(';')) {
    const i = rule.indexOf(':')
    if (i === -1) {
      continue
    }
    const prop = rule
      .slice(0, i)
      .trim()
      .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    out[prop] = rule.slice(i + 1).trim()
  }
  return out
}
