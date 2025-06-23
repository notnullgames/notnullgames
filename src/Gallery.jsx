import Null0Cart from '@/Null0Cart'
import { parse } from 'yaml'

const carts = Object.entries(import.meta.glob('../public/carts/*.yml', { eager: true, query: '?raw' })).map(([filename, m]) => ({ ...parse(m.default), id: filename.replace(/^\.\.\/public\/carts\/(.+)\.yml/, '$1') }))

// TODO: this should be screenshots that play on click (for performance)

export default function Gallery() {
  return (
    <div className='flex gap-4 flex-wrap'>
      {carts.map(({ id, title, description }) => (
        <div className='card bg-base-300 w-96 shadow-sm' key={id}>
          <Null0Cart className='px-10 pt-10' src={`/carts/${id}.null0`} />
          <div className='card-body items-center text-center'>
            <h2 className='card-title'>{title || id}</h2>
            <p>{description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
