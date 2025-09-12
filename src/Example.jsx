// Example component that lets you use source from some other location

import { codeToHtml } from 'shiki'
import { useState, useEffect, useRef } from 'react'
import dark from '@shikijs/themes/vitesse-dark'

// preload all example files
const code = {
  ...import.meta.glob('../examples/**/*.js', { eager: true, query: '?raw' }),
  ...import.meta.glob('../examples/**/*.c', { eager: true, query: '?raw' }),
  ...import.meta.glob('../examples/**/*.nelua', { eager: true, query: '?raw' }),
  ...import.meta.glob('../examples/**/*.nim', { eager: true, query: '?raw' })
}

const getLang = (f) => {
  const ext = f.split('.').pop()

  if (ext === 'nelua') {
    return 'lua'
  }

  return ext
}

export default function Example({ src }) {
  const [out, outSet] = useState(null)
  const [source, sourceSet] = useState('')
  const [tooltip, tooltipSet] = useState('Copy to clipboard')

  useEffect(() => {
    const s = code[`../examples/${src}`]?.default
    sourceSet(s)
    codeToHtml(s, { lang: getLang(src), theme: dark }).then(outSet)
  }, [src])

  const onCopy = async () => {
    await navigator.clipboard.writeText(source)
    tooltipSet('Copied!')
    setTimeout(() => tooltipSet('Copy to clipboard'), 1000)
  }

  return (
    <div className='relative'>
      <div dangerouslySetInnerHTML={{ __html: out }} />
      <div data-tip={tooltip} className='tooltip tooltip-left absolute top-2 right-2'>
        <button className='btn btn-square btn-sm btn-neutral' onClick={onCopy}>
          <svg className='h-5 w-5 fill-current' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
            <path d='M 16 3 C 14.742188 3 13.847656 3.890625 13.40625 5 L 6 5 L 6 28 L 26 28 L 26 5 L 18.59375 5 C 18.152344 3.890625 17.257813 3 16 3 Z M 16 5 C 16.554688 5 17 5.445313 17 6 L 17 7 L 20 7 L 20 9 L 12 9 L 12 7 L 15 7 L 15 6 C 15 5.445313 15.445313 5 16 5 Z M 8 7 L 10 7 L 10 11 L 22 11 L 22 7 L 24 7 L 24 26 L 8 26 Z' />
          </svg>
        </button>
      </div>
      <a className='text-xs absolute bottom-2 right-2 no-underline hover:underline' target='_new' href={`https://github.com/notnullgames/notnullgames/blob/main/examples/${src}`}>
        {src}
      </a>
    </div>
  )
}
