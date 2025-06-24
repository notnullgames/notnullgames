// this is all the pre-parsed page-data (title, slug, content-component, etc)

// simple title-case
const titleCase = (str = '') =>
  str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const pages = []
for (const [filename, m] of Object.entries(import.meta.glob('../pages/**/*.mdx', { eager: true }))) {
  let slug = filename.replace(/^\.\.\/pages\/([a-zA-Z0-1_\/]+)\.mdx/, `$1`)
  const nav = slug.split('/')
  const name = nav.pop()
  const PageComponent = m.default
  const meta = m.frontmatter || {}
  meta.sort ||= 0
  meta.title ||= titleCase(name.replace(/_/g, ' '))
  if (slug === 'home') {
    slug = ''
  }

  pages.push({ slug, nav, name, meta, PageComponent })
}
pages.sort((a, b) => (a.meta.sort < b.meta.sort ? -1 : a.meta.sort > b.meta.sort ? 1 : 0))

export default pages
