import loadCart from './null0-wasm/null0.js'
import { useRef, useEffect } from 'react'

export default function Null0Cart({ src, ...props }) {
  const r = useRef()

  useEffect(() => {
    const c = loadCart(src, r.current)
    console.log(src)
  }, [])

  return <canvas ref={r} {...props}></canvas>
}
