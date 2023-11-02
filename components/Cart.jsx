import { useEffect } from 'react'

export default function ({ cart, fps, fill }) {
  useEffect(() => { import('../public/null0-game-component.js') }, [])
  return (<null0-game width={320} height={240} cart={cart} fps={fps} fill={fill} />)
}
