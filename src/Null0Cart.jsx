import loadCart from './null0-wasm/null0.js'
import { useRef, useEffect } from 'react'

export default function Null0Cart({ src }) {
  const r = useRef()

  useEffect(() => {
    loadCart(src, r.current)
  }, [])

  return <canvas ref={r}></canvas>
}
