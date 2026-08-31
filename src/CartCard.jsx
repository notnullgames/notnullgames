import { getLanguage } from '@/null0'

export default function CartCard({ id, name, lang, title, cart, source }) {
  const language = getLanguage(lang)
  return (
    <div className='card bg-base-300 w-80 shadow-sm'>
      <div className='card-body'>
        <h3 className='card-title !my-0'>{name}</h3>
        <div className='text-xs opacity-70 mb-2'>
          {title}
          {language?.kind === 'interpreted' ? ' (interpreted)' : ''}
        </div>
        <div className='card-actions justify-end'>
          {source && (
            <a target='_new' href={source} className='btn btn-sm btn-secondary'>
              Source
            </a>
          )}
          <a download href={cart} className='btn btn-sm btn-secondary'>
            Download
          </a>
          <a href={`/gallery/${id}`} className='btn btn-sm btn-primary'>
            Play
          </a>
        </div>
      </div>
    </div>
  )
}
