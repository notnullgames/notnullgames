import React from 'react'
import { DocsThemeConfig, Callout } from 'nextra-theme-docs'
import Logo from '@/components/Logo.jsx'

export default {
  logo: <><Logo height={50} width={70} /> notnullgames</>,
  project: {
    link: 'https://github.com/notnullgames/'
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
  }
}
