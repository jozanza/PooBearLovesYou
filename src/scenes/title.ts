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

const BLACK = rgba(0, 0, 0, 255)
const WHITE = rgba(255, 255, 255, 255)

const instructions = `
INSTRUCTIONS:

Poo Bear is hungry. You must feed Poo Bear.
Bring him food he likes, and he will love you.

CONTROLS:

- UP:    move up
- DOWN:  move down
- LEFT:  move left
- RIGHT: move right
`

function print(font: Font, text: string, pos: { x: number; y: number }) {
  drawText(font, text, { x: pos.x - 1, y: pos.y - 1 }, BLACK)
  drawText(font, text, pos, WHITE)
}

let frame = 0
const update: StarshipUpdate<State, Event> = (state, queue) => {
  if (state.scene.timer.entered === 0) {
    console.log('ENTERED')
    frame = 0
  }
  playSound(Sound.MainTheme)
  print(Font.Medium, `POO BEAR LOVES YOU <3`, { x: 8, y: 8 })
  print(Font.Small, instructions, {
    x: 8,
    y: 24,
  })
  if (frame % 64 < 32) {
    print(Font.Medium, `press start`, { x: 86, y: 144 - 24 })
  }
  if (isButtonPressed(Button.Start)) {
    console.log('dispatching from title')
    queue.push({
      type: EventType.ChangeScene,
      data: SceneType.Overworld,
    })
  }

  frame++
}

export default update
