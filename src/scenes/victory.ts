import {
  StarshipUpdate,
  isButtonPressed,
  Button,
  drawText,
  playSound,
  rgba,
} from '@vsmode/starship'
import { Font, Sound } from '../assets'
import { SceneType } from '../scenes'
import { Event, EventType } from '../events'
import { State } from '../state'
import { drawTileMap } from '../tilemap'
import { LEVEL_0 } from '../levels'

const BLACK = rgba(0, 0, 0, 255)
const WHITE = rgba(255, 255, 255, 255)

function print(font: Font, text: string, pos: { x: number; y: number }) {
  drawText(font, text, { x: pos.x - 1, y: pos.y - 1 }, BLACK)
  drawText(font, text, pos, WHITE)
}

let frame = 0
const update: StarshipUpdate<State, Event> = (state, queue) => {
  if (state.scene.timer.entered === 0) {
    console.log('ENTERED')
  }
  playSound(Sound.MainTheme)

  // Draw tilemap
  drawTileMap(LEVEL_0, { x: 0, y: 0 })
  print(Font.Medium, `CONGRATS`, { x: 8, y: 8 })
  print(Font.Small, `You "repaired" your relationship with Poo Bear!`, {
    x: 9,
    y: 25,
  })
  if (frame % 64 < 32) {
    print(Font.Medium, `press start`, {
      x: 86,
      y: 144 - 24,
    })
  }
  // Start game
  if (isButtonPressed(Button.Start)) {
    console.log('dispatching from title')
    queue.push({
      type: EventType.ChangeScene,
      data: SceneType.Title,
    })
  }

  frame++
}

export default update
