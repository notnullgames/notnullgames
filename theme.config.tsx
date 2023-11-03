import React from 'react'

export default {
  logo: <><img src="/logo.png" height="50" width="50" style={{marginRight: 10}}/> notnullgames</>,
  project: {
    link: 'https://github.com/notnullgames/'
  },
  chat: {
    link: 'https://discord.gg/wcR8JkWKJx'
  },
  docsRepositoryBase: 'https://github.com/notnullgames/notnullgames.github.io/blob/main/',

  footer: {
    text: `${new Date().getFullYear()} © notnullgames`
  },
  banner: {
    key: 'incomplete',
    text: 'Keep in mind that we are still building things, so the docs could be totally wrong or incomplete.'
  },
  useNextSeoProps () {
    return {
      titleTemplate: '%s – notnullgames'
    }
  },
  head: (
    <>
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#000000" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="description" content="notnullgames: It's not nothing, and it's game-related." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="/logo.png" />
      <meta property="og:title" content="notnullgames: It's not nothing, and it's game-related." />
      <meta property="og:description" content="notnullgames: It's not nothing, and it's game-related." />
      <meta name="apple-mobile-web-app-title" content="notnullgames" />
    </>
  ),
}
