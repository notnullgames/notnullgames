// Basic layout for all pages

import githubLogo from '@/github-mark-white.png'

// This makes menu of top-level articles that are not home
function MenuTop({ pages, nav, slug }) {
  return [
    ...pages
      .filter((page) => page.slug !== '' && page.nav.length === 0)
      .map((page) => (
        <li key={page.slug}>
          <a href={`/${page.slug}`} className={nav.at(0) === page.slug || slug === page.slug ? 'menu-active' : ''}>
            {page.meta.title}
          </a>
        </li>
      )),
    <li key='github'>
      <a href='https://github.com/notnullgames/'>
        <img className='h-8 w-8' src={githubLogo} />
      </a>
    </li>
  ]
}

// This makes full nav-tree
function MenuNav({ pages, nav, slug, prefix = '/' }) {
  const out = []

  for (const page of pages.filter((p) => p.nav.length === 0)) {
    if (!page.slug) {
      continue
    }
    const subPages = pages.filter((p) => p.nav.at(0) === page.slug).map((p) => ({ ...p, slug: p.slug.replace(new RegExp(`^${page.slug}/`), ''), nav: p.nav.slice(1) }))

    if (subPages.length) {
      out.push(
        <li key={page.slug}>
          <details open>
            <summary className={slug.split('/').at(-1) === page.slug || nav.at(-1) === page.slug ? 'bg-base-300' : ''}>
              <a href={`${prefix}${page.slug}`}>{page.meta.title}</a>
            </summary>
            <ul>
              <MenuNav pages={subPages} nav={nav} slug={slug} prefix={`${prefix}${page.slug}/`} />
            </ul>
          </details>
        </li>
      )
    } else {
      out.push(
        <li key={page.slug}>
          <a href={`${prefix}${page.slug}`} className={nav.at(-1) === page.slug || slug.split('/').at(-1) === page.slug ? 'menu-active' : ''}>
            {page.meta.title}
          </a>
        </li>
      )
    }
  }

  return out
}

export default function Page({ children, pages = [], meta, slug, nav }) {
  return (
    <>
      <header className='navbar bg-base-300 shadow-sm flex flex-row justify-between p-4 fixed top-0 left-0 z-10'>
        <a href='/' className='flex gap-2 items-center'>
          <img src='/logo.svg' className='h-12' />
          <h1 className='text-3xl'>notnull games</h1>
        </a>
        <nav className='px-2 '>
          <ul className='menu menu-horizontal items-center'>
            <MenuTop pages={pages} nav={nav} slug={slug} />
          </ul>
        </nav>
      </header>
      <div className='flex mt-23 gap-4'>
        <nav className='p-4 bg-base-200 text-base-content min-h-screen'>
          <ul className='menu rounded-box bg-base-200 text-base-content ml-4 sticky top-28'>
            <MenuNav pages={pages} nav={nav} slug={slug} />
          </ul>
        </nav>
        <div className='max-w-none prose lg:prose-xl dark:prose-invert overflow-x-auto max-w-full mt-8 pb-8'>
          <h2>{meta.title}</h2>
          <main>{children}</main>
        </div>
      </div>
    </>
  )
}
