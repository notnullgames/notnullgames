// Every API function in one language's syntax, grouped and collapsible.

import { api } from '@/null0'
import Code from '@/Code'

export default function ApiList({ lang }) {
  return (
    <>
      {Object.entries(api.groups).map(([group, funcs]) => (
        <details key={group} className='border border-base-300 rounded p-2 my-2'>
          <summary className='cursor-pointer'>
            {group} <span className='text-sm opacity-60'>({Object.keys(funcs).length})</span>
          </summary>
          {Object.entries(funcs).map(([name, def]) => (
            <div key={name} id={`${lang.id}-${name}`} className='scroll-mt-32'>
              <p className='!mb-1 !mt-4 text-sm opacity-80'>{def.description}</p>
              <Code lang={lang.highlight} className='!mt-0'>
                {lang.decls[name] || `${def.returns} ${name}(...)`}
              </Code>
            </div>
          ))}
        </details>
      ))}
    </>
  )
}
