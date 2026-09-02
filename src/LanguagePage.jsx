// One language's page: how to build a cart in it, its real starter source, a
// playable build of that source, and the whole API in its own syntax.
//
// Everything except the intro blurb comes from the engine's api.json, so a
// language page cannot claim something the engine no longer does.

import { getLanguage, sources, cartList, REPO, RAW } from '@/null0'
import intros from '@/languageIntros'
import Callout from '@/Callout'
import Example from '@/Example'
import Null0Cart from '@/Null0Cart'
import ApiList from '@/ApiList'
import Code from '@/Code'

export default function LanguagePage({ lang: id }) {
  const lang = getLanguage(id)
  const intro = intros[id] || {}
  const source = sources[id]
  const cart = cartList.find((c) => c.lang === id && c.name === 'simple')
  const demos = cartList.filter((c) => c.lang === id && c.name !== 'simple')

  // the engine publishes the full image ref in api.json, so this page can't
  // drift if the registry ever moves again
  const image = lang.imageRef || `ghcr.io/notnullgames/null0-cart-${lang.image}:latest`
  const docker = `docker run --rm --user $(id -u):$(id -g)${lang.amd64Only ? ' --platform linux/amd64' : ''} \\
  -v ./cart:/src -v ./webroot:/out \\
  ${image} mygame`

  return (
    <>
      {intro.blurb && <Callout emoji={intro.emoji}>{intro.blurb}</Callout>}

      <ul>
        <li>
          <strong>Template:</strong>{' '}
          <a target='_new' href={`https://github.com/notnullgames/cart_${id}`}>
            cart_{id}
          </a>{' '}
          - press "Use this template" and you have a working game.
        </li>
        <li>
          <strong>Docker image:</strong> <code>{image}</code>
          {lang.amd64Only && <> (linux/amd64 only - runs emulated on Apple Silicon)</>}
        </li>
        <li>
          <strong>Your code:</strong> <code>cart/{lang.file}</code>, {lang.kind === 'interpreted' ? `interpreted by ${lang.toolchain}` : `compiled with ${lang.toolchain}`}
        </li>
        <li>
          <strong>Bindings:</strong>{' '}
          <a target='_new' href={`${REPO}/blob/main/${lang.binding}`}>
            <code>{lang.binding}</code>
          </a>
          {lang.reference ? ' (a reference list to copy from)' : lang.kind === 'interpreted' ? ' (editor definitions - the runtime provides the API itself)' : ' (baked into the docker image for you)'}
        </li>
        <li>WASI is available, so ordinary file and stdio calls work.</li>
      </ul>

      <h2>building</h2>
      <p>You do not install {lang.toolchain} - the docker image has it, and the current null0 bindings, baked in. That is the whole point: there is nothing in your project to keep in sync with the engine.</p>
      <Code lang='bash'>{docker}</Code>
      <p>
        The{' '}
        <a target='_new' href={`https://github.com/notnullgames/cart_${id}`}>
          template
        </a>{' '}
        wraps that in <code>npm start</code>, which also serves the result and rebuilds when you save.
      </p>

      {lang.notes?.length > 0 && (
        <>
          <h2>{lang.title} notes</h2>
          <ul>
            {lang.notes.map((n) => (
              <li key={n} dangerouslySetInnerHTML={{ __html: inlineCode(n) }} />
            ))}
          </ul>
        </>
      )}

      <h2>a cart, in {lang.title}</h2>
      <p>
        This is <code>{source?.path}</code> in the engine repo - the same file CI builds into the cart below, so it always compiles.
      </p>
      <Example lang={id} />
      {cart && <Null0Cart src={cart.cart} />}
      {lang.entry && (
        <p>
          This toolchain needs an entry point to exist even though null0 never uses it for gameplay. Leave it empty: <code>{lang.entry}</code>
        </p>
      )}

      <h2>callbacks</h2>
      <p>A cart implements the callbacks it cares about. In {lang.title} they look like this:</p>
      <Code lang={lang.highlight}>{lang.callback}</Code>
      <p>
        See <a href='/null0/cart'>anatomy of a cart</a> for the full list and what each one is passed.
      </p>

      {demos.length > 0 && (
        <>
          <h2>more {lang.title} carts</h2>
          <ul>
            {demos.map((c) => (
              <li key={c.id}>
                <a href={`/gallery/${c.id}`}>{c.name}</a> -{' '}
                <a target='_new' href={c.source}>
                  source
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>the API, in {lang.title}</h2>
      <p>
        Every null0 function, spelled the way {lang.title} spells it. These are read out of{' '}
        <a target='_new' href={`${RAW}/${lang.binding}`}>
          the generated bindings
        </a>{' '}
        themselves, so they match what your editor completes.
      </p>
      <p>
        Grouped below, or read them alongside each function's description on the <a href={`/null0/api#${lang.id}`}>full API reference</a> - that link opens it already set to {lang.title}.
      </p>
      <ApiList lang={lang} />
    </>
  )
}

// the notes are written as markdown-ish prose with `code` spans in them
function inlineCode(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}
