// very simple flappy-bird

const images = {}
let font_text
let score = 0

const bird = {
  angle: 0,
  x: SCREEN_WIDTH / 2,
  y: SCREEN_HEIGHT / 2
}

let t = 0

// simple game-state system
let currentState = 'title'
const updateHandlers = {
  title(t) {
    draw_parallax(images['sky'], t / 10, 0, 914)
    draw_parallax(images['land'], t, 360, 640)
    draw_image(images.logo, 120, 60)
    draw_bird(t)
  },

  playing(t) {
    // gravity
    bird.y += 3

    // very stupid score system
    if (t % 120 === 119) {
      score++
    }

    draw_parallax(images['sky'], t / 10, 0, 914)
    draw_parallax(images['land'], t, 360, 640)
    draw_bird(t)
    draw_text(font_text, score, 30, 30, WHITE)

    if (bird.y > 320) {
      currentState = 'over'
      draw_text(font_text, 'GAME OVER!', 160, 240, WHITE)
    }
  },

  paused(t) {
    // draw nothing, so it doesn't override
  },

  over(t) {
    // draw nothing, so it doesn't override
  }
}

const buttonHandlers = {
  title(button) {
    if ([GAMEPAD_BUTTON_A, GAMEPAD_BUTTON_B, GAMEPAD_BUTTON_START].includes(button)) {
      currentState = 'playing'
    }
  },

  playing(button) {
    if ([GAMEPAD_BUTTON_A, GAMEPAD_BUTTON_B].includes(button)) {
      bird.y -= 40
    }

    if (button === GAMEPAD_BUTTON_START) {
      currentState = 'paused'
    }
  },

  paused(button) {
    if (button === GAMEPAD_BUTTON_START) {
      currentState = 'playing'
    }
  },

  over(button) {
    if ([GAMEPAD_BUTTON_A, GAMEPAD_BUTTON_B, GAMEPAD_BUTTON_START].includes(button)) {
      currentState = 'playing'
      bird.angle = 0
      bird.x = SCREEN_WIDTH / 2
      bird.y = SCREEN_HEIGHT / 2
      score = 0
    }
  }
}

// draw current state of bird
function draw_bird(t) {
  const i = `bird${Math.floor(t / 10) % 3}`
  if (images[i]) {
    draw_image_rotated(images[i], bird.x, bird.y, bird.angle, bird.ox, bird.oy, FILTER_NEARESTNEIGHBOR)
  }
}

// draw continuous looping image (for parallax background)
function draw_parallax(image, x, y, width) {
  draw_image(image, width - (x % width), y)
  draw_image(image, width - (x % width) - width, y)
}

export function load() {
  for (const n of ['bird0', 'bird1', 'bird2', 'land', 'logo', 'sky']) {
    images[n] = load_image(`assets/${n}.png`)
    if (!images[n]) {
      console.log(`${n} image could not be loaded.`)
    }
  }

  font_text = load_font_tty('assets/font_text.png', 36, 32, ' !*+,-./0123"456789:;<=#>?@ABCDEFG$HIJKLMNOPQ%RSTUVWXYZ[&\\]^_`\'(){|}~')
}

export function update() {
  updateHandlers[currentState](t++)
}

export function buttonDown(button, player) {
  buttonHandlers[currentState](button)
}
