// Embeds a playable cart, using null0's own <null0-cart> web component loaded
// straight from the engine's github-pages. Nothing about the player - the
// emscripten host, the zip reader, the WASI shim - is vendored into this repo,
// so a cart on this page always runs on the current engine.

import { useEffect, useState } from 'react'
import { CDN } from '@/null0'

const PLAYER = `${CDN}/null0-cart.js`

export default function Null0Cart({ src, eager = false, className = '', ...props }) {
  const [failed, failedSet] = useState(false)

  useEffect(() => {
    // absolute URL, so it has to be a runtime import vite leaves alone
    import(/* @vite-ignore */ PLAYER).catch((error) => {
      console.error('could not load the null0 player', error)
      failedSet(true)
    })
  }, [])

  if (failed) {
    return (
      <div className='alert alert-warning'>
        <span>
          Could not load the null0 player.{' '}
          <a download href={src}>
            Download the cart
          </a>{' '}
          and run it with the <a href='https://github.com/notnullgames/null0/releases'>native runtime</a> instead.
        </span>
      </div>
    )
  }

  return <null0-cart src={src} loading={eager ? 'eager' : undefined} class={`block w-full max-w-2xl ${className}`} {...props} />
}
