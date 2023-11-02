// this is a web-component for playing a game
// it glues the browser-engine to the web-container

/* global HTMLElement, requestAnimationFrame */

// TODO: add gamepads
// TODO: setup canLog & canSound and auto-respond to prop-changes

import * as zip from '@zip.js/zip.js'
import {
  BUTTON_B,
  BUTTON_Y,
  BUTTON_SELECT,
  BUTTON_START,
  BUTTON_UP,
  BUTTON_DOWN,
  BUTTON_LEFT,
  BUTTON_RIGHT,
  BUTTON_A,
  BUTTON_X,
  BUTTON_L,
  BUTTON_R,
  Null0Game
} from './Null0Game.js'

// mapping of keys to null0 buttons (matches libretro defaults)
export const keyMap = {
  KeyX: BUTTON_A,
  KeyZ: BUTTON_B,
  KeyS: BUTTON_X,
  KeyA: BUTTON_Y,
  KeyQ: BUTTON_L,
  KeyW: BUTTON_R,
  Enter: BUTTON_START,
  ShiftRight: BUTTON_SELECT,
  ArrowLeft: BUTTON_LEFT,
  ArrowRight: BUTTON_RIGHT,
  ArrowUp: BUTTON_UP,
  ArrowDown: BUTTON_DOWN
}

export class Null0GameComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.innerHTML = `
      <style>
      canvas {
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        object-fit: contain;
      }
      canvas.landscape {
        height: 100vh;
        max-width: 100vw;
      }
      canvas.portrait {
        width: 100vw;
        max-height: 100vh;
      }
      #mute {
        position: absolute;
        right: 10px;
        top: 10px;
      }
      #container {
        position: relative;
        display:inline-block;
      }
      </style>
      <div id="container">
        <img src="https://notnullgames.github.io/mute.png" id="mute" />
        <canvas tabindex="1" width="320" height="240" id="canvas"></canvas>
      </div>
    `
  }

  static get observedAttributes () {
    return ['cart', 'fps', 'fill', 'logOk']
  }

  async attributeChangedCallback (name, oldValue, newValue) {
    // required: the URL of the cart
    const cart = this.getAttribute('cart')
    if (!cart) {
      return
    }

    // show FPS?
    const fps = this.getAttribute('fps') !== null

    // show nice proportion on full-window
    const fill = this.getAttribute('fill') !== null

    // is it ok to log?
    const logOk = this.getAttribute('logOK') !== null

    const mute = this.shadow.getElementById('mute')
    const canvas = this.shadow.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    if (fill) {
      const onResize = () => {
        window.removeEventListener('resize', onResize)
        setTimeout(() => {
          window.addEventListener('resize', onResize)
        }, 1000)
        const { clientWidth, clientHeight } = document.body
        canvas.className = clientWidth > clientHeight ? 'landscape' : 'portrait'
      }
      onResize()
    }

    const bytes = await fetch(cart).then(r => r.arrayBuffer())
    const fileHeader = new Uint8Array(bytes).subarray(0, 4).toString()

    let zipFile
    let wasmBinary

    if (fileHeader === '80,75,3,4') { // zip
      const z = new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(bytes)))
      zipFile = (await z.getEntries()).filter(f => !f.directory && !f.filename.split('/').pop().startsWith('.') && !f.filename.startsWith('__'))
      const c = zipFile.find(f => f.filename === 'main.wasm')
      if (!c) {
        throw new Error('No cart.wasm')
      }
      wasmBinary = await c.getData(new zip.Uint8ArrayWriter())
    } else if (fileHeader === '0,97,115,109') { // wasm
      wasmBinary = bytes
    } else {
      throw new Error(`Cart must either be zip of wasm (${cart}).`)
    }

    const null0 = new Null0Game(wasmBinary, canvas, fps, zipFile, logOk)
    await null0.init()

    // handle focus for input/sound
    canvas.addEventListener('focus', () => {
      null0.soundOK = true
      null0.logOk = true
      null0.handlePendingSound()
      null0.unmute()
      mute.style.display = 'none'
    })
    canvas.addEventListener('focusout', () => {
      null0.soundOK = false
      null0.logOk = false
      null0.mute()
      mute.style.display = 'block'
    })

    canvas.addEventListener('keydown', e => {
      e.preventDefault()
      if (typeof keyMap[e.code] !== 'undefined') {
        null0.buttonDown(keyMap[e.code])
      }
    })

    canvas.addEventListener('keyup', e => {
      e.preventDefault()
      if (typeof keyMap[e.code] !== 'undefined') {
        null0.buttonUp(keyMap[e.code])
      }
    })

    const animate = () => {
      requestAnimationFrame(animate)
      null0.update()
    }
    animate()
  }

  async connectedCallback () {
  }
}

if (typeof window !== 'undefined') {
  try {
    window.customElements.define('null0-game', Null0GameComponent)
  } catch (e) {}
}
