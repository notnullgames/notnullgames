import CartCard from '@/CartCard'
import { parse } from 'yaml'

const carts = Object.entries(import.meta.glob('../public/carts/*.yml', { eager: true, query: '?raw' })).map(([filename, m]) => ({ ...parse(m.default), id: filename.replace(/^\.\.\/public\/carts\/(.+)\.yml/, '$1') }))

export default function Gallery() {
  return (
    <div className='flex gap-4 flex-wrap'>
      {carts.map((cart) => (
        <CartCard key={cart.id} {...cart}></CartCard>
      ))}
    </div>
  )
}
