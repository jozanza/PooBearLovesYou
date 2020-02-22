import {
  StarshipUpdate,
  isButtonPressed,
  Button,
  drawText,
  playSound,
} from '@vsmode/starship'
import { Font, Sound } from '../assets'
import { SceneType } from '../scenes'
import { Event, EventType } from '../events'
import { State } from '../state'

const update: StarshipUpdate<State, Event> = (state, queue) => {
  if (state.scene.timer.entered === 0) {
    console.log('ENTERED')
  }
  playSound(Sound.MainTheme)
  drawText(Font.Medium, `POO BEAR LOVES YOU <3`, { x: 8, y: 8 })
  if (isButtonPressed(Button.Start)) {
    console.log('dispatching from title')
    queue.push({
      type: EventType.ChangeScene,
      data: SceneType.Overworld,
    })
  }
}

export default update
