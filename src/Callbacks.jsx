// The input callbacks, from the engine's API definition rather than a list
// typed out here that would slowly stop matching.

import { api } from '@/null0'

export default function Callbacks() {
  return (
    <pre className='overflow-x-auto'>
      <code>
        {Object.entries(api.callbacks)
          .map(
            ([name, def]) =>
              `// ${def.description}\nvoid ${name}(${Object.entries(def.args)
                .map(([n, t]) => `${t} ${n}`)
                .join(', ')});`
          )
          .join('\n\n')}
      </code>
    </pre>
  )
}
