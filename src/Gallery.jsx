import Null0Cart from '@/Null0Cart'
import { parse } from 'yaml'

const meta = []
const carts = []

export default function Gallery() {
  return (
    <div className='flex gap-4 flex-wrap'>
      {carts.map((src) => (
        <>
          <Null0Cart key={src} src={`/carts/${src}`} />
          <pre>{JSON.stringify(meta.find(({ id }) => id === src.replace(/\.null0$/, '')))}</pre>
        </>
      ))}
    </div>
  )
}
