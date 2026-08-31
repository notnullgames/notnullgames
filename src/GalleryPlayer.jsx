// One cart, playable, with a link to the source that built it.

import { useLocation } from 'react-router'
import Page from '@/Page'
import pages from '@/pages'
import Null0Cart from '@/Null0Cart'
import { getCart, getLanguage } from '@/null0'

export default function GalleryPlayer() {
  const slug = useLocation().pathname.replace('/gallery/', '')
  const cart = getCart(slug)

  if (!cart) {
    return (
      <Page pages={pages} slug={slug} nav={['gallery']} meta={{ title: 'Not found' }}>
        <p>
          No cart called <code>{slug}</code>. <a href='/null0/gallery'>Back to the gallery</a>.
        </p>
      </Page>
    )
  }

  const language = getLanguage(cart.lang)

  return (
    <Page pages={pages} slug={slug} nav={['gallery']} meta={{ title: cart.name }}>
      <div className='text-sm'>
        in <a href={`/null0/languages/${cart.lang}`}>{cart.title}</a>
      </div>
      <Null0Cart src={cart.cart} eager />
      <div className='flex gap-2 mt-4 not-prose'>
        <a target='_new' href={cart.source} className='btn btn-secondary'>
          Source
        </a>
        <a download href={cart.cart} className='btn btn-secondary'>
          Download
        </a>
      </div>
      <p className='text-sm mt-4'>
        Built from <code>{cart.id}</code> with <code>konsumer/null0-cart-{language?.image}</code>. Grab{' '}
        <a target='_new' href='https://github.com/notnullgames/null0/releases'>
          the native runtime
        </a>{' '}
        to play it outside a browser.
      </p>
    </Page>
  )
}
