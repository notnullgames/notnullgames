import { getLanguage, CDN } from '@/null0'

// The screenshot is taken by null0's CI, by running the cart in the real web
// player - so it's published next to the .null0 it depicts and can never show
// something the cart doesn't do.
export default function CartCard({ id, name, lang, title, cart, source }) {
  const language = getLanguage(lang)
  return (
    <div className='card bg-base-300 w-80 shadow-sm'>
      <figure className='bg-black'>
        <img src={`${CDN}/carts/${id}.png`} alt={`${name} in ${title}`} width='640' height='480' loading='lazy' className='w-full aspect-[4/3] object-cover' />
      </figure>
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
