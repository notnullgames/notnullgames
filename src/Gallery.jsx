import CartCard from '@/CartCard'
import carts from '@/carts'

export default function Gallery() {
  return (
    <div className='flex gap-4 flex-wrap'>
      {carts.map((cart) => (
        <CartCard key={cart.id} {...cart}></CartCard>
      ))}
    </div>
  )
}
