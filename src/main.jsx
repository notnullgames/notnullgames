import { ViteReactSSG } from 'vite-react-ssg'

import './style.css'
import Page from './Page'

// simple title-case
const titleCase = (str = '') =>
  str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

// Build the entire site-tree with nav and components
const pages = []
for (const [filename, m] of Object.entries(import.meta.glob('../pages/**/*.mdx', { eager: true }))) {
  let slug = filename.replace(/^\.\.\/pages\/([a-zA-Z0-1_\/]+)\.mdx/, `$1`)
  const nav = slug.split('/')
  const name = nav.pop()
  const PageComponent = m.default
  const meta = m.frontmatter || {}
  meta.sort ||= 0
  meta.title ||= titleCase(name)
  if (slug === 'home') {
    slug = ''
  }

  pages.push({ slug, nav, name, meta, PageComponent })
}
pages.sort((a, b) => (a.meta.sort < b.meta.sort ? -1 : a.meta.sort > b.meta.sort ? 1 : 0))

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

export const createRoot = ViteReactSSG(
  // react-router-dom data routes
  { routes },
  // function to have custom setups
  ({ router, routes, isClient, initialState }) => {
    // do something.
  }
)
