// -----------------------------------------------------------------------------
// Typedefs
// -----------------------------------------------------------------------------

export interface Vector2 {
  x: number
  y: number
}

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export interface Color {
  r: number
  g: number
  b: number
  a: number
}

export interface StarshipConfig {
  title: string
  window: Vector2
  canvas: Vector2
  fps?: number
}

export type StarshipInit<T = unknown> = () => T

export type StarshipDestroy<T> = (state: T) => void

export type StarshipUpdate<T = unknown, E = unknown> = (
  state: T,
  queue: E[],
) => boolean | void

// -----------------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------------

let FRAME = 0

export function getFrame() {
  return FRAME
}

/** Runs the game */
export function run<T, E>(
  config: StarshipConfig,
  init: StarshipInit<T>,
  destroy: StarshipDestroy<T>,
  update: StarshipUpdate<T, E>,
) {
  const oldCanvas = document.querySelector('canvas')
  oldCanvas?.parentNode?.removeChild(oldCanvas)
  FRAME = 0
  GFX = document.createElement('canvas').getContext('2d')!
  GFX.imageSmoothingEnabled = false
  GFX.canvas.tabIndex = 0
  GFX.canvas.width = config.canvas.x
  GFX.canvas.height = config.canvas.y
  GFX.canvas.style.imageRendering = 'pixelated'
  GFX.canvas.style.objectFit = 'contain'
  GFX.canvas.style.background = '#f0f'
  GFX.canvas.style.width = '100vw'
  GFX.canvas.style.height = '100vh'
  document.body.appendChild(GFX.canvas)
  const fps = config.fps ?? 60
  let state = init()
  let queue: E[] = []
  const stop = setAnimationFrame(() => {
    if (update(state, queue)) {
      destroy(state)
      stop()
    }
    FRAME++
  }, 1000 / fps)
}

function setAnimationFrame(cb: () => void, fps: number) {
  let globalThis = window as any
  let then: number = performance.now()
  let now: number
  let delta: number
  let error: Error
  function start() {
    // Set timer globally for hot-reloading
    globalThis.STARSHIP_TIMER = requestAnimationFrame(start)
    now = performance.now()
    delta = now - then
    if (delta > fps) {
      then = now - (delta % fps)
      try {
        cb()
      } catch (err) {
        if (!error) {
          error = err
          console.log(err)
        }
      }
    }
  }
  function stop() {
    cancelAnimationFrame(globalThis.STARSHIP_TIMER)
  }
  stop()
  start()
  return stop
}

// -----------------------------------------------------------------------------
// IO
// -----------------------------------------------------------------------------

export enum Button {
  A = 90, // Z
  B = 88, // X
  Up = 265,
  Down = 264,
  Left = 263,
  Right = 262,
  Start = 257, // Enter
  Select = 32, // Spacebar
}

function keyToButton(key: string): void | Button {
  // prettier-ignore
  switch(key) {
    case 'z': return Button.A
    case 'x': return Button.B
    case 'ArrowUp': return Button.Up
    case 'ArrowDown': return Button.Down
    case 'ArrowLeft': return Button.Left
    case 'ArrowRight': return Button.Right
    case 'Enter': return Button.Start
    case ' ': return Button.Select
  }
}

const BUTTONS: { [key in Button]: number } = {
  [Button.A]: 0,
  [Button.B]: 0,
  [Button.Up]: 0,
  [Button.Down]: 0,
  [Button.Left]: 0,
  [Button.Right]: 0,
  [Button.Start]: 0,
  [Button.Select]: 0,
}

window.onkeyup = (e: KeyboardEvent) => {
  const btn = keyToButton(e.key)
  if (btn) BUTTONS[btn] = 0
}

window.onkeydown = (e: KeyboardEvent) => {
  const btn = keyToButton(e.key)
  if (btn && !BUTTONS[btn]) {
    BUTTONS[btn] = performance.now()
  }
}

/** Checks if a button is pressed this frame */
export function isButtonDown(btn: Button) {
  return BUTTONS[btn] > 0
}

/** Checks if a button is held down this frame */
export function isButtonPressed(btn: Button) {
  let delta = performance.now() - BUTTONS[btn]
  return delta < 16.666 // 1 frame at 60 FPS
}

// -----------------------------------------------------------------------------
// Audio
// -----------------------------------------------------------------------------

const SOUNDS = new Map<string, HTMLAudioElement>()

const noop = () => {}

export function playSound(src: string) {
  if (!SOUNDS.has(src)) {
    const audio = new Audio(src)
    SOUNDS.set(src, audio)
  }
  if (!isSoundPlaying(src))
    SOUNDS.get(src)
      ?.play()
      // "handle" playback errors and prevent dev overlay from blowing up
      .then(noop)
      .catch(noop)
}

export function stopSound(src: string) {
  const sound = SOUNDS.get(src)
  if (sound) {
    sound.pause()
    sound.currentTime = 0
  }
}

export function isSoundPlaying(src: string) {
  const paused = SOUNDS.get(src)?.paused ?? true
  return !paused
}

// -----------------------------------------------------------------------------
// Graphics
// -----------------------------------------------------------------------------

// TODO: Use WebGL
let GFX: CanvasRenderingContext2D
let TXT: CanvasRenderingContext2D
const FONTS = new Map<string, { data: HTMLImageElement; charSize: Vector2 }>()
const SPRITES = new Map<string, HTMLImageElement>()

export const BLACK = rgba(0, 0, 0, 255)
export const WHITE = rgba(255, 255, 255, 255)
export const RED = rgba(255, 0, 0, 255)

/** Creates a Color */
export function rgba(r: number, g: number, b: number, a: number = 255) {
  return { r, g, b, a }
}

/** Clears the canvas */
export function clear(color: Color = BLACK) {
  const { width, height } = GFX.canvas
  GFX.clearRect(0, 0, width, height)
  rectfill({ x: 0, y: 0, width, height }, color)
}

/** Draws a filled rectangle */
export function rectfill(rect: Rectangle, color: Color) {
  const { x, y, width: w, height: h } = rect
  const { r, g, b, a } = color
  GFX.fillStyle = `rgba(${r},${g},${b},${a / 255})`
  GFX.fillRect(Math.floor(x), Math.floor(y), w, h)
  GFX.fillStyle = 'transparent'
}

/** Draws a sprite */
export function sprite(src: string, rect: Rectangle, pos: Vector2) {
  if (!SPRITES.has(src)) {
    if (FONTS.has(src)) {
      SPRITES.set(src, FONTS.get(src)!.data)
    } else {
      const img = new Image()
      img.src = src
      SPRITES.set(src, img)
    }
  }
  GFX.drawImage(
    SPRITES.get(src)!,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    Math.floor(pos.x),
    Math.floor(pos.y),
    rect.width,
    rect.height,
  )
}

/** Draws text */
export function print(
  src: string,
  text: string,
  pos: Vector2,
  color: Color = WHITE,
) {
  if (!FONTS.has(src)) {
    const img = new Image()
    img.src = src
    // TODO: dynamic charSizes (hard-coded for now)
    const charSize = /thicc/.test(src) ? { x: 7, y: 7 } : { x: 4, y: 4 }
    const font = {
      data: img,
      charSize,
    }
    FONTS.set(src, font)
  }
  const font = FONTS.get(src)!
  const cols = 16
  // const rows = 6
  const charCodeOffset = 32
  let cursorX = 0
  let cursorY = 0

  const { r, g, b, a } = color
  const needsMask = r !== 255 || g !== 255 || b !== 255 || a !== 255
  let OGX: CanvasRenderingContext2D

  // Swap the current drawing canvas with an offscreen one
  if (needsMask) {
    OGX = GFX
    TXT = document.createElement('canvas').getContext('2d')!
    TXT.imageSmoothingEnabled = false
    TXT.canvas.width = GFX.canvas.width
    TXT.canvas.height = GFX.canvas.height
    GFX = TXT
  }

  // Draw text
  for (const char of text) {
    const i = char.charCodeAt(0) - charCodeOffset
    const x = i % cols
    const y = Math.floor(i / cols)
    if (char === '\n') {
      cursorX = 0
      cursorY += font.charSize.y + Math.floor(font.charSize.y / 2)
    }
    sprite(
      src,
      {
        x: x * font.charSize.x + x + 1,
        y: y * font.charSize.y + y + 1,
        width: font.charSize.x,
        height: font.charSize.y,
      },
      {
        x: Math.floor(pos.x) + cursorX,
        y: Math.floor(pos.y) + cursorY,
      },
    )
    cursorX += font.charSize.x + 1
  }

  // Draw the offscreen canvas into the visible canvas
  if (needsMask) {
    GFX = OGX!
    TXT.globalCompositeOperation = 'source-in'
    TXT.fillStyle = `rgba(${r},${g},${b},${a / 255})`
    TXT.fillRect(0, 0, TXT.canvas.width, TXT.canvas.height)
    GFX.drawImage(TXT.canvas, 0, 0)
  }
}
