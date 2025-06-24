// This shows a single cart

import { useLocation } from 'react-router'
import Page from '@/Page'
import carts from '@/carts'
import pages from '@/pages'
import Null0Cart from '@/Null0Cart'

export default function GalleryPlayer(props) {
  const lc = useLocation()
  const slug = lc.pathname.replace('/gallery/', '')
  const cart = carts.find((c) => c.id === slug)
  const displayTitle = cart.title || cart.id
  return (
    <Page pages={pages} slug={slug} nav={['gallery']} meta={{ title: displayTitle }}>
      <div className='text-sm'>by {cart.author}</div>
      <Null0Cart src={`/carts/${slug}.null0`}></Null0Cart>
      <div className='flex gap-2 mt-4'>
        <a target='_new' href={cart.source} className='btn btn-secondary'>
          Source
        </a>
        <a download href={`/carts/${slug}.null0`} className='btn btn-secondary'>
          Download
        </a>
      </div>
      <div>{cart.description}</div>
    </Page>
  )
}
