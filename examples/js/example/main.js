// put this file in the cart-zip
import mod from './mod.js'

export function load() {
  console.log('JS cart says "hi"')
  console.log(`${mod.name} loaded`)
}

export function update() {
  clear(BLUE)
  draw_rectangle(10, 10, 100, 50, RED)
  if (key_down(KEY_SPACE)) {
    draw_text(FONT_DEFAULT, 'Space pressed!', 50, 50, WHITE)
  }
}
