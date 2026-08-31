// Everything the site knows about null0, pulled from the engine at build time.
// See vite-plugin-null0.js - none of this is maintained by hand here.

import api from 'virtual:null0-api'
import carts from 'virtual:null0-carts'
import sources from 'virtual:null0-sources'

export const CDN = 'https://notnullgames.github.io/null0'
export const REPO = 'https://github.com/notnullgames/null0'
export const RAW = 'https://raw.githubusercontent.com/notnullgames/null0/main'

export { api, sources }

export const languages = Object.values(api.languages)
export const languageIds = languages.map((l) => l.id)

export const getLanguage = (id) => api.languages[id]

// rust keeps its examples one level deeper than everyone else
export const examplePath = (lang, name) => (lang === 'rust' ? `carts/rust/examples/${name}` : `carts/${lang}/${name}`)

// A published cart is named `<example>_<lang>`, e.g. simple_c, demo_lua. The
// suffix is the language id, so the name alone tells us where its source is.
function parseCart(id) {
  const idx = languageIds
    .map((l) => (id.endsWith(`_${l}`) ? l : null))
    .filter(Boolean)
    // `_c` also matches the tail of `_c3`, so prefer the longest match
    .sort((a, b) => b.length - a.length)[0]

  if (!idx) {
    return { id, name: id, lang: null }
  }
  const name = id.slice(0, -(idx.length + 1))
  return {
    id,
    name,
    lang: idx,
    title: api.languages[idx]?.title || idx,
    cart: `${CDN}/carts/${id}.null0`,
    source: `${REPO}/tree/main/${examplePath(idx, name)}`
  }
}

export const cartList = carts.map(parseCart)

export const getCart = (id) => cartList.find((c) => c.id === id)
