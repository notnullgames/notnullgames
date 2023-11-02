// this is the null0 browser-engine

/* global WebAssembly, OffscreenCanvas, FontFace, Image, Blob, Audio */

import * as zip from '@zip.js/zip.js'
import defaultFont from './default_font.js'
import SamJs from 'sam-js'

// get the list of imports/exports for a WASM module
async function getWasmInterface (m) {
  const out = { imports: {}, exports: WebAssembly.Module.exports(m) }
  for (const r of WebAssembly.Module.imports(m)) {
    out.imports[r.module] = out.imports[r.module] || {}
    if (r.kind === 'function') {
      out.imports[r.module][r.name] = () => {}
    }
  }
  return out
}

// get the dimensions of every character in BM font
function getBmAtlas (image, chars) {
  const canvas = new OffscreenCanvas(image.width, image.height)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(image, 0, 0)

  // get the line-color
  const cline = ctx.getImageData(0, 0, 1, 1).data.toString()

  const lines = [1]
  for (let x = 1; x < image.width; x++) {
    const ccur = ctx.getImageData(x, 0, 1, 1).data.toString()
    if (ccur === cline) {
      lines.push(x - 1)
    }
  }

  const atlas = {}
  for (const c in chars.split('')) {
    const char = chars[c]
    const x = lines[c]
    const w = lines[parseInt(c) + 1] - x
    atlas[char] = { x: x + 2, y: 0, w: w - 1, h: image.height }
  }
  return atlas
}

// get the dimensions of every character in TTY font
function getTtyAtlas (image, chars, height, width) {
  const atlas = {}
  const rects = []
  for (let y = 0; y < image.height; y += height) {
    for (let x = 0; x < image.width; x += width) {
      rects.push({ x, y, w: width, h: height })
    }
  }
  for (const c in chars) {
    const char = chars[c]
    atlas[char] = rects[c]
  }
  return atlas
}

// wait for the image to be marked loaded (for dependant actions)
function waitForImage (img) {
  return new Promise((resolve, reject) => {
    if (img.loaded) {
      return resolve()
    }
    let count = 0
    const i = setInterval(() => {
      count++
      if (img.loaded) {
        clearInterval(i)
        return resolve()
      }
      if (count > 100) {
        clearInterval(i)
        return reject(new Error('Too many loops for image'))
      }
    }, 100)
  })
}

// make sure TTS voices are loaded
function loadVoices () {
  return new Promise(
    (resolve, reject) => {
      const synth = window.speechSynthesis
      let count = 0
      const id = setInterval(() => {
        count++
        if (synth.getVoices().length !== 0) {
          resolve(synth.getVoices())
          clearInterval(id)
        }
        if (count > 100) {
          clearInterval(id)
          return reject(new Error('Too many loops for TTS'))
        }
      }, 100)
    }
  )
}

const TO_RADIANS = Math.PI / 180
function rotateAndPaintImage (context, image, angleInDeg, positionX, positionY, axisX, axisY) {
  const angleInRad = angleInDeg * TO_RADIANS
  context.translate(positionX, positionY)
  context.rotate(angleInRad)
  context.drawImage(image, -axisX, -axisY)
  context.rotate(-angleInRad)
  context.translate(-positionX, -positionY)
}

// null0 buttons
export const BUTTON_B = 0
export const BUTTON_Y = 1
export const BUTTON_SELECT = 2
export const BUTTON_START = 3
export const BUTTON_UP = 4
export const BUTTON_DOWN = 5
export const BUTTON_LEFT = 6
export const BUTTON_RIGHT = 7
export const BUTTON_A = 8
export const BUTTON_X = 9
export const BUTTON_L = 10
export const BUTTON_R = 11
export const BUTTON_L2 = 12
export const BUTTON_R2 = 13
export const BUTTON_L3 = 14
export const BUTTON_R3 = 15

// shared string codec
const tencoder = new TextEncoder('utf8')
const tdecoder = new TextDecoder('utf8')

export class Null0Game {
  constructor (wasmBytes, canvas, fps, zipFile) {
    this.wasmBytes = wasmBytes
    this.zipFile = zipFile
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.zip = zip
    this.logOk = false
    this.showFps = fps
    this.soundOK = false
    this.pendingSounds = {}
    this.muted = false
  }

  mute () {
    for (const s of this.sounds || []) {
      if (s?.type === 'sample') {
        s.audio.muted = true
      }

      if (s?.type === 'tts') {
        s.muted = true
      }
    }
  }

  unmute () {
    for (const s of this.sounds || []) {
      if (s?.type === 'sample') {
        s.audio.muted = false
      }

      if (s?.type === 'tts') {
        s.muted = false
      }
    }
  }

  handlePendingSound () {
    this.soundOK = true
    for (const s of Object.keys(this.pendingSounds)) {
      if (this.sounds[s].type === 'sample') {
        if (this.pendingSounds[s].time !== 0) {
          this.sounds[s].audio.play()
          this.sounds[s].audio.currentTime = (Date.now() - this.pendingSounds[s].time) / 1000
        }
        if (this.pendingSounds[s].loop) {
          this.sounds[s].audio.loop = true
        }
        delete this.pendingSounds[s]
      }
    }
  }

  update () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (this?.cart?.update) {
      const elapsed = Date.now() - this.startTime
      this.fps = Math.round(1000 / (elapsed / ++this.frameCount) * 100) / 100
      this.cart.update(elapsed)
    }

    if (this.showFps) {
      this.imports.env.draw_text(0, 0, this.fps.toFixed(2).toString(), 270, 20)
    }
  }

  buttonUp (button) {
    if (this?.cart?.buttonUp) {
      this.cart.buttonUp(button)
    }
  }

  buttonDown (button) {
    if (this?.cart?.buttonDown) {
      this.cart.buttonDown(button)
    }
  }

  unload () {
    if (this?.cart?.unload) {
      this.cart.unload()
    }
  }

  getColor (pointer) {
    const b = this.HEAPU8[pointer + 0]
    const g = this.HEAPU8[pointer + 1]
    const r = this.HEAPU8[pointer + 2]
    const a = this.HEAPU8[pointer + 3]
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  getBytes (ptr, length) {
    return this.HEAPU8.subarray(ptr, ptr + length)
  }

  getString (ptr) {
    let i = 0
    while (true) {
      i++
      if (this.HEAPU8[ptr + i] === 0) {
        break
      }
    }
    return tdecoder.decode(this.getBytes(ptr, i))
  }

  async init () {
    try {
      this.voices = await loadVoices()
    } catch (e) {
      console.log('TODO: no native TTS on this platform')
    }

    this.startTime = Date.now()
    this.frameCount = 0
    this.fps = 0
    this.gamePadeState = [false, false, false, false, false, false, false, false, false, false, false, false]
    this.gamePadeStateOld = [false, false, false, false, false, false, false, false, false, false, false, false]

    this.images = []
    this.images.push({
      canvas: this.canvas,
      context: this.context
    })
    this.fonts = []
    this.fonts.push({
      type: 'tty',
      height: 8,
      width: 8,
      image: new Image(),
      chars: "\x7f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
    })
    this.fonts[0].image.addEventListener('load', () => {
      this.fonts[0].atlas = getTtyAtlas(this.fonts[0].image, this.fonts[0].chars, 8, 8)
    })
    this.fonts[0].image.src = defaultFont

    this.sounds = []

    // this will stub imports, so you can override
    const mod = await WebAssembly.compile(this.wasmBytes)
    const { imports } = await getWasmInterface(mod)

    // debug missing functions
    for (const f of Object.keys(imports.env)) {
      imports.env[f] = (...args) => console.log(`env.${f}`, args)
    }
    for (const f of Object.keys(imports.wasi_snapshot_preview1)) {
      imports.wasi_snapshot_preview1[f] = (...args) => console.log(`wasi_snapshot_preview1.${f}`, args)
    }

    // TODO: need to work these out for file access

    //     imports.env.__syscall_lstat64 = (pathPtr, bufPtr) => {
    //       const path = this.getString(pathPtr)
    //       console.log('__syscall_lstat64', { pathPtr, path, bufPtr })
    //     }
    //
    //     imports.env.__syscall_newfstatat = (dirfd, pathPtr, bufPtr, flags) => {
    //       const path = this.getString(pathPtr)
    //       console.log('__syscall_newfstatat', { dirfd, pathPtr, path, bufPtr, flags })
    //     }
    //
    //     imports.env.__syscall_stat64 = (pathPtr, bufPtr) => {
    //       const path = this.getString(pathPtr)
    //       console.log('__syscall_newfstatat', { pathPtr, path, bufPtr })
    //     }

    imports.wasi_snapshot_preview1.fd_write = (fd, iov, iovcnt, pnum) => {
      if (fd !== 1) {
        throw new Error('Only fd #1 (console) implemented')
      }
      if (!this.logOk) {
        return iovcnt
      }
      let num = 0
      for (let i = 0; i < iovcnt; i++) {
        const ptr = this.HEAPU32[((iov) >> 2)]
        const len = this.HEAPU32[(((iov) + (4)) >> 2)]
        const out = new Uint8Array(len + 1)
        iov += 8
        for (let j = 0; j < len; j++) {
          out[j] = this.HEAPU8[ptr + j]
        }

        // newline by itself: \n\0
        if (out.toString() !== '10,0') {
          console.log(tdecoder.decode(out).trim())
        }

        num += len
      }
      this.HEAPU32[((pnum) >> 2)] = num
      return 0
    }

    imports.env.clear_background = (dst, color) => {
      this.images[dst].context.fillStyle = this.getColor(color)
      this.images[dst].context.rect(0, 0, this.images[dst].canvas.width, this.images[dst].canvas.height)
      this.images[dst].context.fill()
    }

    imports.env.image_scale = (src, scaleX, scaleY) => {
      const dst = this.images.length
      this.images.push(undefined)

      const innerWorker = async () => {
        await waitForImage(this.images[src])
        this.images[dst] = {
          canvas: document.createElement('canvas')
        }
        this.images[dst].canvas.width = this.images[src].canvas.width * scaleX
        this.images[dst].canvas.height = this.images[src].canvas.height * scaleY
        this.images[dst].context = this.images[dst].canvas.getContext('2d')
        this.images[dst].context.drawImage(this.images[src].canvas, 0, 0, this.images[src].canvas.width, this.images[src].canvas.height, 0, 0, this.images[dst].canvas.width, this.images[dst].canvas.height)
      }
      innerWorker()
      return dst
    }

    imports.env.load_image = (filenamePtr) => {
      const dst = this.images.length
      this.images.push(undefined)

      let filename = this.getString(filenamePtr)
      if (filename[0] === '/') {
        filename = filename.substr(1)
      }

      if (!this.zipFile) {
        throw new Error(`${filename} cannot be loaded in ${dst}, due to no cart.`)
      }

      const canvas = document.createElement('canvas')
      this.images[dst] = { canvas, context: canvas.getContext('2d'), loaded: false }

      const img = new Image()
      img.addEventListener('load', () => {
        // URL.revokeObjectURL(img.src)
        this.images[dst].loaded = true
        this.images[dst].canvas.width = img.width
        this.images[dst].canvas.height = img.height
        this.images[dst].context.drawImage(img, 0, 0, img.width, img.height)
      })
      const f = this.zipFile.findIndex(f => f.filename === filename)
      if (f === -1) {
        console.error(`File not found: ${filename}`)
      } else {
        this.zipFile[f].getData(new this.zip.Uint8ArrayWriter())
          .then(fi => {
            img.src = URL.createObjectURL(new Blob([fi]))
          })
      }

      return dst
    }

    imports.env.gradient_vertical = (width, height, top, bottom) => {
      const dst = this.images.length
      this.images.push(undefined)

      if (dst !== 0 && !this.images[dst]) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        this.images[dst] = { canvas, context: canvas.getContext('2d') }
      }

      const ctx = this.images[dst].context
      const grd = ctx.createLinearGradient(0, 0, 0, height)
      grd.addColorStop(0, this.getColor(top))
      grd.addColorStop(1, this.getColor(bottom))
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, width, height)

      return dst
    }

    imports.env.gradient_horizontal = (width, height, top, bottom) => {
      const dst = this.images.length
      this.images.push(undefined)

      if (dst !== 0 && !this.images[dst]) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        this.images[dst] = { canvas, context: canvas.getContext('2d') }
      }

      const ctx = this.images[dst].context
      const grd = ctx.createLinearGradient(0, 0, width, 0)
      grd.addColorStop(0, this.getColor(top))
      grd.addColorStop(1, this.getColor(bottom))
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, width, height)

      return dst
    }

    imports.env.draw_image = (dst, src, posX, posY) => {
      if (!this.images[dst]) {
        return
      }
      if (!this.images[src]) {
        return
      }
      this.images[dst].context.drawImage(this.images[src].canvas, posX, posY, this.images[src].canvas.width, this.images[src].canvas.height)
    }

    imports.env.draw_image_rotated = (dst, src, posX, posY, rot) => {
      if (!this.images[dst]) {
        return
      }
      if (!this.images[src]) {
        return
      }
      rotateAndPaintImage(this.images[dst].context, this.images[src].canvas, rot, posX, posY, this.images[src].canvas.width / 2, this.images[src].canvas.height / 2)
    }

    imports.env.draw_circle = (dst, centerX, centerY, radius, color) => {
      if (!this.images[dst]) {
        throw new Error(`${dst} image not initialized.`)
      }
      const ctx = this.images[dst].context
      ctx.fillStyle = this.getColor(color)
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.fill()
    }

    imports.env.draw_rectangle = (dst, posX, posY, width, height, colorPtr) => {
      if (!this.images[dst]) {
        throw new Error(`${dst} image not initialized.`)
      }
      const ctx = this.images[dst].context
      ctx.fillStyle = this.getColor(colorPtr)
      ctx.beginPath()
      ctx.fillRect(posX, posY, width, height)
    }

    imports.env.draw_text = (dst, font, textPtr, posX, posY) => {
      if (!this.images[dst]) {
        throw new Error(`${dst} image not initialized.`)
      }
      if (!this.fonts[font]) {
        return
      }
      const ctx = this.images[dst].context
      const text = typeof textPtr === 'string' ? textPtr : this.getString(textPtr)
      const f = this.fonts[font]

      if (f.type === 'tty' || f.type === 'bm') {
        let offset = 0
        if (f.atlas) {
          for (const c of text) {
            const atlas = f.atlas[c]
            if (atlas) {
              ctx.drawImage(f.image, atlas.x, atlas.y, atlas.w, atlas.h, posX + offset, posY, atlas.w, atlas.h)
              offset += atlas.w
            }
          }
        }
      }

      if (f.type === 'ttf') {
        ctx.fillStyle = f.color
        ctx.font = f.face
        ctx.fillText(text, posX, posY + (f.fontSize * 0.6))
      }
    }

    imports.env.load_font_ttf = (filenamePtr, fontSize, colorPtr) => {
      const dst = this.fonts.length
      this.fonts.push(undefined)

      const innerWorker = async () => {
        const filename = this.getString(filenamePtr)
        const f = this.zipFile.findIndex(f => f.filename === filename)
        if (f === -1) {
          console.error(`File not found: ${filename}`)
        } else {
          const fi = await this.zipFile[f].getData(new this.zip.Uint8ArrayWriter())
          const url = URL.createObjectURL(new Blob([fi]))
          const face = new FontFace(`font${dst}`, `url("${url}")`)
          await face.load()
          document.fonts.add(face)
          // URL.revokeObjectURL(url)
          this.fonts[dst] = {
            type: 'ttf',
            color: this.getColor(colorPtr),
            face: `${fontSize / 1.2}px font${dst}`,
            fontSize
          }
        }
      }

      innerWorker()
      return dst
    }

    imports.env.load_font_bm = (filenamePtr, charsPtr) => {
      const dst = this.fonts.length
      this.fonts.push(undefined)

      const innerWorker = async () => {
        const filename = this.getString(filenamePtr)
        const chars = this.getString(charsPtr)
        const image = new Image()
        image.addEventListener('load', () => {
          this.fonts[dst].atlas = getBmAtlas(image, chars)
        // URL.revokeObjectURL(image.src)
        })

        const f = this.zipFile.findIndex(f => f.filename === filename)
        if (f === -1) {
          console.error(`File not found: ${filename}`)
        } else {
          const fi = await this.zipFile[f].getData(new this.zip.Uint8ArrayWriter())
          image.src = URL.createObjectURL(new Blob([fi]))
          this.fonts[dst] = {
            type: 'bm',
            image,
            chars
          }
        }
      }
      innerWorker()
      return dst
    }

    imports.env.load_font_tty = (filenamePtr, width, height, charsPtr) => {
      const dst = this.fonts.length
      this.fonts.push(undefined)

      const innerWorker = async () => {
        const filename = this.getString(filenamePtr)
        const chars = this.getString(charsPtr)
        const image = new Image()
        image.addEventListener('load', () => {
          this.fonts[dst].atlas = getTtyAtlas(image, chars, height, width)
        // URL.revokeObjectURL(image.src)
        })

        const f = this.zipFile.findIndex(f => f.filename === filename)
        if (f === -1) {
          console.error(`File not found: ${filename}`)
        } else {
          const fi = await this.zipFile[f].getData(new this.zip.Uint8ArrayWriter())
          image.src = URL.createObjectURL(new Blob([fi]))
          this.fonts[dst] = {
            type: 'tty',
            image,
            chars
          }
        }
      }
      innerWorker()
      return dst
    }

    imports.env.load_speech = (textPtr) => {
      const dst = this.sounds.length
      this.sounds.push(undefined)

      const text = this.getString(textPtr)
      this.sounds[dst] = {
        type: 'tts',
        text,
        speed: 72,
        pitch: 64,
        throat: 128,
        mouth: 128,
        phonetic: false,
        muted: false
      }

      return dst
    }

    imports.env.set_speech_param = (dst, paramPtr, value) => {
      if (!this.sounds[dst]) {
        return
      }

      const param = this.getString(paramPtr)

      if (!['speed', 'pitch', 'throat', 'mouth', 'phonetic'].includes(param)) {
        console.error(`Unknown param: ${param}`)
        return
      }

      if (param === 'phonetic') {
        this.sounds[dst].phonetic = !!value
      } else {
        this.sounds[dst][param] = value
      }
    }

    imports.env.set_speech_text = (dst, textPtr) => {
      if (!this.sounds[dst]) {
        return
      }
      this.sounds[dst].text = this.getString(textPtr)
    }

    imports.env.load_sound = (filenamePtr) => {
      const dst = this.sounds.length
      this.sounds.push(undefined)

      const innerWorker = async () => {
        let filename = this.getString(filenamePtr)
        if (filename[0] === '/') {
          filename = filename.substr(1)
        }

        if (!this.soundOK) {
          this.pendingSounds[dst] = this.pendingSounds[dst] || { time: 0 }
        }

        if (!this.zipFile) {
          throw new Error(`${filename} cannot be loaded in ${dst}, due to no cart.`)
        }

        const f = this.zipFile.findIndex(f => f.filename === filename)
        if (f === -1) {
          throw new Error(`${filename} is not found in cart.`)
        }
        const aud = new Audio()
        const data = await this.zipFile[f].getData(new zip.Uint8ArrayWriter())
        aud.src = URL.createObjectURL(new Blob([data]))

        this.sounds[dst] = {
          type: 'sample',
          audio: aud,
          loaded: false
        }

        // gapless audio looping
        this.sounds[dst].audio.addEventListener('timeupdate', () => {
          const aud = this.sounds[dst].audio
          if (aud.loop && aud.currentTime > aud.duration - 0.44) {
            aud.currentTime = 0
            aud.play()
          }
        })

        this.sounds[dst].audio.addEventListener('canplaythrough', () => {
          this.sounds[dst].loaded = true
        })
      }
      innerWorker()

      return dst
    }

    imports.env.play_sound = (dst) => {
      if (!this.soundOK) {
        this.pendingSounds[dst] = this.pendingSounds[dst] || {}
        this.pendingSounds[dst].time = Date.now()
        return
      }

      if (!this.sounds[dst]) {
        return
      }

      if (this.sounds[dst].type === 'tts') {
        const { pitch, speed, mouth, throat, phonetic, text, muted } = this.sounds[dst]
        if (!muted) {
          const sam = new SamJs({ debug: 0, pitch, speed, mouth, throat })
          sam.speak(text, phonetic)
        }
        return
      }

      if (this.sounds[dst].type === 'sample') {
        this.sounds[dst].audio.play()
        return
      }
      console.log(`Not Implemented: play_sound(${dst})`, this.sounds[dst])
    }

    imports.env.stop_sound = (dst) => {
      if (!this.sounds[dst]) {
        return
      }
      // there is no stop, so this is a hack to stop it
      this.sounds[dst].audio.load()
    }

    imports.env.set_sound_loop = (dst, loop) => {
      if (this.pendingSounds[dst]) {
        this.pendingSounds[dst].loop = loop
        return
      }

      if (!this.sounds[dst]) {
        return
      }

      if (this.sounds[dst].type === 'sample') {
        this.sounds[dst].audio.loop = loop
      }
    }

    const { exports } = await WebAssembly.instantiate(mod, imports)
    this.cart = exports
    this.imports = imports

    // call top-level WASI entry, if it's there
    if (this.cart._initialize) {
      this.cart._initialize()
    }

    this.HEAPU32 = new Uint32Array(this.cart.memory.buffer)
    this.HEAPU8 = new Uint8Array(this.cart.memory.buffer)

    // call null0 entry, if it's there
    if (this.cart.load) {
      this.cart.load()
    } else {
      console.log('no load() in main.wasm')
    }
  }
}
