import { ViteReactSSG } from 'vite-react-ssg'
import '@/style.css'
import Page from '@/Page'
import pages from '@/pages'
import GalleryPlayer from '@/GalleryPlayer'

const routes = pages.map(({ PageComponent, slug, ...info }) => {
  const route = {
    path: `/${slug}`,
    element: (
      <Page pages={pages} slug={slug} {...info}>
        <PageComponent />
      </Page>
    )
  }
  if (slug === '') {
    route.path = '/'
    route.index = true
  }
  return route
})

routes.push({
  path: '/gallery/:cartId',
  element: <GalleryPlayer />
})

export const createRoot = ViteReactSSG(
  // react-router-dom data routes
  { routes },
  // function to have custom setups
  ({ router, routes, isClient, initialState }) => {
    // do something.
  }
)
