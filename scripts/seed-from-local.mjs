// Seed src/null0-data.json from a local null0 checkout, for when the engine's
// github-pages hasn't published the new api.json yet (it deploys on tags).
//   node scripts/seed-from-local.mjs ../null0
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = process.argv[2] || '../null0'
const api = JSON.parse(await readFile(join(root, 'webroot/api.json'), 'utf8'))

const sources = Object.fromEntries(
  await Promise.all(
    Object.values(api.languages).map(async (lang) => {
      const path = `${lang.example}/${lang.file}`
      return [lang.id, { path, code: await readFile(join(root, path), 'utf8') }]
    })
  )
)

// the live cart list, which is published independently of a tag
const carts = (await fetch('https://notnullgames.github.io/null0/carts/list.txt').then((r) => r.text()))
  .trim()
  .split('\n')
  .map((n) => n.trim().replace(/\.null0$/, ''))
  .filter(Boolean)
  .sort()

await writeFile('src/null0-data.json', JSON.stringify({ api, carts, sources }, null, 2) + '\n')
console.log(`seeded from ${root}: null0 v${api.version}, ${Object.keys(api.languages).length} languages, ${carts.length} carts`)
