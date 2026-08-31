// Index of every cart language, grouped by how a cart gets built.

import { languages } from '@/null0'
import intros from '@/languageIntros'

function Card({ lang }) {
  const intro = intros[lang.id] || {}
  return (
    <a href={`/null0/languages/${lang.id}`} className='card bg-base-300 w-80 shadow-sm no-underline hover:bg-base-200'>
      <div className='card-body'>
        <h3 className='card-title !my-0'>
          {intro.emoji && <span className='not-prose'>{intro.emoji}</span>}
          {lang.title}
        </h3>
        <p className='text-sm !my-1'>{intro.blurb}</p>
        <div className='text-xs opacity-60'>
          <code>cart/{lang.file}</code> &middot; <code>null0-cart-{lang.image}</code>
        </div>
      </div>
    </a>
  )
}

export default function Languages() {
  const compiled = languages.filter((l) => l.kind === 'compiled')
  const interpreted = languages.filter((l) => l.kind === 'interpreted')

  return (
    <>
      <h2>compiled</h2>
      <p>
        Your code becomes <code>main.wasm</code>. These make the smallest, fastest carts.
      </p>
      <div className='flex gap-4 flex-wrap not-prose my-4'>
        {compiled.map((l) => (
          <Card key={l.id} lang={l} />
        ))}
      </div>

      <h2>interpreted</h2>
      <p>
        The interpreter <em>is</em> <code>main.wasm</code>, and your script rides along inside the cart. Bigger files, but nothing to compile and the cart stays readable.
      </p>
      <div className='flex gap-4 flex-wrap not-prose my-4'>
        {interpreted.map((l) => (
          <Card key={l.id} lang={l} />
        ))}
      </div>
    </>
  )
}
