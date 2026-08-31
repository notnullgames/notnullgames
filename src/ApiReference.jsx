// The whole null0 API, rendered from the engine's generated api.json.
//
// Pick a language and every signature switches to that language's real
// declaration - not a transliteration written here, but the line out of that
// language's generated bindings, so it is exactly what your editor sees.

import { useState } from 'react'
import { api, languages, REPO } from '@/null0'
import LanguagePicker from '@/LanguagePicker'

const PSEUDO = { id: '', title: 'pseudo-code', highlight: 'c' }

// the C-like pseudo-code the docs describe the API in, when no language is picked
const pseudoSignature = (name, def) =>
  `${def.returns} ${name}(${Object.entries(def.args)
    .map(([n, t]) => `${t} ${n}`)
    .join(', ')})`

function Signature({ name, def, lang }) {
  const decl = lang?.decls?.[name]
  return (
    <pre className='!my-2 overflow-x-auto'>
      <code>{decl || pseudoSignature(name, def)}</code>
    </pre>
  )
}

function Func({ name, def, lang }) {
  return (
    <div id={name} className='scroll-mt-32'>
      <h4 className='!mb-1'>{name}</h4>
      <p className='!my-1'>{def.description}</p>
      <Signature name={name} def={def} lang={lang} />
    </div>
  )
}

export default function ApiReference() {
  const [langId, langIdSet] = useState('')
  const lang = langId ? api.languages[langId] : null

  return (
    <>
      <p>
        This is generated from{' '}
        <a target='_new' href={`${REPO}/tree/main/api`}>
          the engine's API definition
        </a>
        , for null0 <code>{api.version}</code>. Pick a language to see every signature in that language's own spelling.
      </p>

      <LanguagePicker value={langId} onChange={langIdSet} emptyLabel='pseudo-code' />

      <p className='text-sm'>
        Showing <strong>{lang ? lang.title : PSEUDO.title}</strong>.{' '}
        {lang ? (
          <>
            These come straight out of{' '}
            <a target='_new' href={`${REPO}/blob/main/${lang.binding}`}>
              <code>{lang.binding}</code>
            </a>
            . <a href={`/null0/languages/${lang.id}`}>More about {lang.title} carts</a>.
          </>
        ) : (
          'Structs are passed by pointer under the hood, but every high-level binding hides that for you.'
        )}
      </p>

      <h2>types</h2>
      <p>These are the types of parameters, or things a function can return.</p>
      <ul>
        {Object.entries(api.scalars).map(([name, t]) => (
          <li key={name}>
            <code>{name}</code> - {t.description}
          </li>
        ))}
      </ul>

      <h3>structs</h3>
      <p>A compound object, used to pass several values at once.</p>
      {Object.entries(api.structs).map(([name, s]) => (
        <div key={name}>
          <h4 className='!mb-1'>{name}</h4>
          <p className='!my-1'>{s.description}</p>
          <pre className='!my-2 overflow-x-auto'>
            <code>
              {Object.entries(s.members)
                .map(([m, t]) => `${t} ${m}`)
                .join('\n')}
            </code>
          </pre>
        </div>
      ))}

      <h3>enums</h3>
      <p>A named set of values for an integer field. Every one of these is available as a plain constant in your cart.</p>
      {Object.entries(api.enums).map(([name, e]) => (
        <details key={name}>
          <summary>
            <code>{name}</code> - {e.description}
          </summary>
          <pre className='overflow-x-auto'>
            <code>
              {Object.entries(e.enums)
                .map(([n, v]) => `${n} = ${v}`)
                .join('\n')}
            </code>
          </pre>
        </details>
      ))}

      <h3>colors</h3>
      <p>Pre-defined in every cart language:</p>
      <div className='flex flex-wrap gap-2 not-prose my-4'>
        {Object.entries(api.constants)
          .filter(([, c]) => c.type === 'Color')
          .map(([name, c]) => (
            <div key={name} className='flex items-center gap-2 text-xs border border-base-300 rounded px-2 py-1'>
              <span className='inline-block h-4 w-4 rounded border border-base-content/20' style={{ background: `rgba(${c.value[0]}, ${c.value[1]}, ${c.value[2]}, ${c.value[3] / 255})` }} />
              <code>{name}</code>
            </div>
          ))}
      </div>

      <h3>constants</h3>
      <ul>
        {Object.entries(api.constants)
          .filter(([, c]) => c.type !== 'Color')
          .map(([name, c]) => (
            <li key={name}>
              <code>{name}</code> = <code>{String(c.value)}</code>
              {c.description ? ` - ${c.description}` : ''}
            </li>
          ))}
      </ul>

      <h2>callbacks</h2>
      <p>
        Callbacks are how you define your game - implement the ones you need and the host skips the rest. See <a href='/null0/cart'>anatomy of a cart</a>.
      </p>
      {lang && (
        <pre className='overflow-x-auto'>
          <code>{lang.callback}</code>
        </pre>
      )}
      {Object.entries(api.callbacks).map(([name, def]) => (
        <Func key={name} name={name} def={def} lang={null} />
      ))}

      <h2>api</h2>
      <p>These are the things you can do in your game.</p>
      {Object.entries(api.groups).map(([group, funcs]) => (
        <div key={group}>
          <h3 id={group} className='scroll-mt-32'>
            {group}
          </h3>
          {Object.entries(funcs).map(([name, def]) => (
            <Func key={name} name={name} def={def} lang={lang} />
          ))}
        </div>
      ))}
    </>
  )
}
