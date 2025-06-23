// very simple flappy-bird

const images = {}
const sounds = {}
let font_text
let font_bignumbers
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

      if (score === 5) {
        stop_sound(sounds.music1)
        play_sound(sounds.music2, true)
        stop_sound(sounds.music3)
      }

      if (score === 10) {
        stop_sound(sounds.music1)
        stop_sound(sounds.music2)
        play_sound(sounds.music3, true)
      }
    }

    draw_parallax(images['sky'], t / 10, 0, 914)
    draw_parallax(images['land'], t, 360, 640)
    draw_bird(t)
    draw_text(font_bignumbers, score, 30, 30, WHITE)

    if (bird.y > 320) {
      currentState = 'over'
      draw_text(font_text, 'GAME OVER!', 160, 240, WHITE)
      play_sound(sounds.hit)
      stop_sound(sounds.music1)
      stop_sound(sounds.music2)
      stop_sound(sounds.music3)
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
      play_sound(sounds.music1, true)
    }
  },

  playing(button) {
    if ([GAMEPAD_BUTTON_A, GAMEPAD_BUTTON_B].includes(button)) {
      bird.y -= 40
      play_sound(sounds.wing)
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
      play_sound(sounds.music1, true)
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
  font_text = load_font_tty('assets/font_pixel-18x16.png', 36, 32, ' !*+,-./0123"456789:;<=#>?@ABCDEFG$HIJKLMNOPQ%RSTUVWXYZ[&\\]^_`\'(){|}~')
  font_bignumbers = load_font_tty('assets/font_bignumbers.png', 48, 72, '0123456789 ')

  for (const n of ['bird0', 'bird1', 'bird2', 'land', 'logo', 'pipe-bottom', 'pipe-top', 'sky']) {
    images[n] = load_image(`assets/${n}.png`)
    if (!images[n]) {
      console.log(`${n} image could not be loaded.`)
    } else {
      // my assets were all made for 320x240 so 2x them
      const i = image_scale(images[n], 2, 2, FILTER_NEARESTNEIGHBOR)
      unload_image(images[n])
      images[n] = i
    }
  }

  for (const n of ['hit', 'point', 'swooshing', 'wing', 'music1', 'music2', 'music3']) {
    sounds[n] = load_sound(`assets/sounds/${n}.ogg`)
  }
}

export function update() {
  updateHandlers[currentState](t++)
}

export function buttonDown(button, player) {
  buttonHandlers[currentState](button)
}
