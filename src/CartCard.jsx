import Null0Cart from '@/Null0Cart'

// TODO: there is not a great way to completely wipe a wasm, but it would be better if I could remove it only when it should play

export default function CartCard({ id, title, description, author, language }) {
  const displayTitle = title || id
  return (
    <div className='card bg-base-300 w-96 shadow-s z-0'>
      <div className='card-body'>
        <h2 className='card-title !my-0'>{displayTitle}</h2>
        {author && <div className='text-xs mb-2'>{author}</div>}
        <Null0Cart src={`/carts/${id}.null0`} />
        {description && <div>{description}</div>}
      </div>
    </div>
  )
}
