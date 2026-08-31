// Pulls null0's own generated API data in at build time.
//
// The engine generates webroot/api.json (every function, type, constant, and
// each of the 23 languages' real declaration for all of them) and publishes it
// to github-pages along with the built carts. Rather than keep a hand-copied
// snapshot of any of that in this repo - which is exactly how the old api.mdx
// ended up a year out of date - the site fetches it while building.
//
// Three virtual modules:
//   virtual:null0-api      the api.json above
//   virtual:null0-carts    the list of published carts (carts/list.txt)
//   virtual:null0-sources  each language's `simple` cart source, as text
//
// If the network is unavailable the build falls back to the committed copy in
// src/null0-data.json, so a build never breaks over this. `npm run sync` is
// what refreshes that copy.

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const CDN = 'https://notnullgames.github.io/null0'
export const RAW = 'https://raw.githubusercontent.com/notnullgames/null0/main'

const MODULES = {
  'virtual:null0-api': 'api',
  'virtual:null0-carts': 'carts',
  'virtual:null0-sources': 'sources'
}

const FALLBACK = 'src/null0-data.json'

// rust keeps its examples one level deeper than everyone else
export const examplePath = (lang, name) => (lang === 'rust' ? `carts/rust/examples/${name}` : `carts/${lang}/${name}`)

async function get(url, as = 'text') {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} for ${url}`)
  }
  return as === 'json' ? res.json() : res.text()
}

export async function fetchAll() {
  const api = await get(`${CDN}/api.json`, 'json')

  const carts = (await get(`${CDN}/carts/list.txt`))
    .trim()
    .split('\n')
    .map((n) => n.trim().replace(/\.null0$/, ''))
    .filter(Boolean)
    .sort()

  // every language's starter cart, so a language page can show real,
  // currently-building code instead of a snippet someone typed once
  const sources = Object.fromEntries(
    await Promise.all(
      Object.values(api.languages).map(async (lang) => {
        const url = `${RAW}/${lang.example}/${lang.file}`
        return [lang.id, { path: `${lang.example}/${lang.file}`, code: await get(url) }]
      })
    )
  )

  return { api, carts, sources }
}

export function null0Data({ root = process.cwd() } = {}) {
  const fallbackPath = resolve(root, FALLBACK)
  let data

  async function load() {
    if (data) {
      return data
    }
    try {
      data = await fetchAll()
    } catch (error) {
      console.warn(`[null0] could not reach ${CDN} (${error.message}); using ${FALLBACK}`)
      data = JSON.parse(await readFile(fallbackPath, 'utf8'))
    }
    return data
  }

  return {
    name: 'null0-data',
    resolveId(id) {
      return id in MODULES ? `\0${id}` : null
    },
    async load(id) {
      const key = MODULES[id.replace(/^\0/, '')]
      if (!key || !id.startsWith('\0')) {
        return null
      }
      return `export default ${JSON.stringify((await load())[key])}`
    }
  }
}

// `npm run sync` - refresh the committed fallback from the live engine
if (process.argv[1] && process.argv[1].endsWith('vite-plugin-null0.js')) {
  const data = await fetchAll()
  await writeFile(FALLBACK, JSON.stringify(data, null, 2) + '\n')
  console.log(`wrote ${FALLBACK}: null0 v${data.api.version}, ${Object.keys(data.api.languages).length} languages, ${data.carts.length} carts`)
}
