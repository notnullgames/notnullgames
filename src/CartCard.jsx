import Null0Cart from '@/Null0Cart'

// TODO: there is not a great way to completely wipe a wasm, but it would be better if I could remove/add the wasm

export default function CartCard({ id, title, description, author, language, source }) {
  const displayTitle = title || id
  return (
    <div className='card bg-base-300 w-96 shadow-s z-0'>
      <div className='card-body'>
        <h2 className='card-title !my-0'>{displayTitle}</h2>
        {author && <div className='text-xs mb-2'>{author}</div>}
        {/*<Null0Cart src={`/carts/${id}.null0`} />*/}
        <img src={`/carts/${id}.png`} alt={displayTitle} />
        {description && <div>{description}</div>}
        <div className='card-actions justify-end'>
          <a target='_new' href={source} className='btn btn-secondary'>
            Source
          </a>
          <a download href={`/carts/${id}.null0`} className='btn btn-secondary'>
            Download
          </a>
          <a href={`gallery/${id}`} className='btn btn-primary'>
            Play
          </a>
        </div>
      </div>
    </div>
  )
}
