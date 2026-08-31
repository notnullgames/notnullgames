// One stub page per cart language, so every language shows up in the sidebar.
// The page itself is <LanguagePage>, driven by the engine's api.json - these
// files exist only to give the nav something to enumerate.
//
// Run after `npm run sync` if null0 gained a language.
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises'

const { api } = JSON.parse(await readFile('src/null0-data.json', 'utf8'))
const langs = Object.values(api.languages)

// C first, then the rest of the compiled ones, then the interpreted ones
const sort = (lang, i) => (lang.id === 'c' ? -100 : lang.kind === 'compiled' ? i : 100 + i)

const dir = 'pages/null0/languages'
await mkdir(dir, { recursive: true })

// drop pages for languages that no longer exist
const keep = new Set(langs.map((l) => `${l.id}.mdx`))
for (const f of await readdir(dir)) {
  if (!keep.has(f)) {
    await rm(`${dir}/${f}`)
    console.log(`removed ${f}`)
  }
}

for (const [i, lang] of langs.entries()) {
  await writeFile(
    `${dir}/${lang.id}.mdx`,
    `---
title: ${lang.title}
sort: ${sort(lang, i)}
---

import LanguagePage from '@/LanguagePage'

<LanguagePage lang='${lang.id}' />
`
  )
}
console.log(`wrote ${langs.length} language pages`)
