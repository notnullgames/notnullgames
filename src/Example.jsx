// Shows a cart's real source, fetched from the null0 repo at build time.
// There is no copy of any example in this repo - what you read here is the
// file CI is currently building into the cart right below it.

import { codeToHtml } from 'shiki'
import { useState, useEffect } from 'react'
import { getLanguage, sources, REPO } from '@/null0'

export default function Example({ lang }) {
  const language = getLanguage(lang)
  const source = sources[lang]
  const [out, outSet] = useState(null)
  const [tooltip, tooltipSet] = useState('Copy to clipboard')

  useEffect(() => {
    if (!source) {
      return
    }
    codeToHtml(source.code, { lang: language?.highlight || 'text', theme: 'vitesse-dark' })
      .then(outSet)
      .catch(() => outSet(null))
  }, [lang])

  if (!source) {
    return null
  }

  const onCopy = async () => {
    await navigator.clipboard.writeText(source.code)
    tooltipSet('Copied!')
    setTimeout(() => tooltipSet('Copy to clipboard'), 1000)
  }

  return (
    <div className='relative'>
      {out ? <div dangerouslySetInnerHTML={{ __html: out }} /> : <pre className='overflow-x-auto'>{source.code}</pre>}
      <div data-tip={tooltip} className='tooltip tooltip-left absolute top-2 right-2'>
        <button className='btn btn-square btn-sm btn-neutral' onClick={onCopy} aria-label='Copy to clipboard'>
          <svg className='h-5 w-5 fill-current' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
            <path d='M 16 3 C 14.742188 3 13.847656 3.890625 13.40625 5 L 6 5 L 6 28 L 26 28 L 26 5 L 18.59375 5 C 18.152344 3.890625 17.257813 3 16 3 Z M 16 5 C 16.554688 5 17 5.445313 17 6 L 17 7 L 20 7 L 20 9 L 12 9 L 12 7 L 15 7 L 15 6 C 15 5.445313 15.445313 5 16 5 Z M 8 7 L 10 7 L 10 11 L 22 11 L 22 7 L 24 7 L 24 26 L 8 26 Z' />
          </svg>
        </button>
      </div>
      <a className='text-xs absolute bottom-2 right-2 no-underline hover:underline' target='_new' href={`${REPO}/blob/main/${source.path}`}>
        {source.path}
      </a>
    </div>
  )
}
