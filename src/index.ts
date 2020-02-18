import {
  StarshipConfig,
  StarshipUpdate,
  // gfx
  clear,
  print,
  // io
  // Button,
  // isButtonDown,
  // isButtonPressed,
  // audio
  playSound,
  run,
  StarshipInit,
  StarshipDestroy,
} from './starship'
import { Sound, Font } from './common'
import { State } from './state'
import { Event, EventType } from './events'
import { createScene, SceneType } from './scenes'
import updateTitleScene from './scenes/title'
import updateOverworldScene from './scenes/overworld'

/**
 * Game configuration
 */
const config: StarshipConfig = {
  title: 'Poo Bear Loves You <3',
  window: { x: 512, y: 512 },
  canvas: { x: 256, y: 144 },
  fps: 60,
}

/**
 * Creates the initial game state
 */
const init: StarshipInit<State> = () => {
  return {
    scene: createScene(SceneType.Overworld),
  }
}

/**
 * Runs before game ends
 */
const destroy: StarshipDestroy<State> = _ => {
  // nothing to do here :)
}

/**
 * Main update loop
 */
const update: StarshipUpdate<State, Event> = (state, queue) => {
  clear()

  // Debug
  print(Font.Medium, JSON.stringify(state, null, 2), { x: 0, y: 41 })

  // Scenes
  switch (state.scene.type) {
    case SceneType.Title: {
      updateTitleScene(state, queue)
      break
    }
    case SceneType.Overworld: {
      updateOverworldScene(state, queue)
      break
    }
  }
  state.scene.timer.entered++

  // Events
  const next: Event[] = []
  while (queue.length) {
    // Drain the queue
    const e = queue.pop()!
    console.log('Event ->', e)
    // Handle "global" events
    switch (e?.type) {
      case EventType.ChangeScene: {
        state.scene = createScene(e.data)
        break
      }
      // Push unprocessed events into the next queue
      default:
        next.push(e)
    }
  }
  // Push scene events into the global queue
  queue.push(...next)
}

run<State, Event>(config, init, destroy, update)
