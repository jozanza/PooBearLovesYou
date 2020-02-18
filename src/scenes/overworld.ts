import {
  StarshipUpdate,
  isButtonPressed,
  Button,
  print,
  playSound,
  sprite,
  Vector2,
  rectfill,
  rgba,
  isButtonDown,
} from '../starship'
import { Font, Sound } from '../common'
import { SceneType } from '../scenes'
import { Event, EventType } from '../events'
import { State } from '../state'
import { tilemapOfString, drawTileMap, hasCollision } from '../tilemap'

const LEVEL_0 = tilemapOfString(
  `
l l . . . . . ' . . . . . . r r
. " ' * . . ' p t t . . . . ' l
. r " r . . . l . . r ' " . . .
. . p . . . . l . " . " . . * .
. . . . * l . ' . . . p r . . .
. . . . . . . . . . . r p . . .
" t . . . . . ╭ ╴ ╴ ╴ ╴ ╴ ╮ . .
* l . ' t p * ╷ ~ ~ ~ ~ ~ ╵ . t
. . ' " p . . ╰ ╶ ╶ ╶ ╶ ╶ ╯ t t
`,
  { x: 16, y: 9 },
)

// prettier-ignore
let x = 32, y = 32, width = 16, height = 16
const prevPos: Vector2[] = []

const update: StarshipUpdate<State, Event> = (state, queue) => {
  if (state.scene.timer.entered === 0) {
    console.log('ENTERED')
  }

  // Play audio
  playSound(Sound.MainTheme)

  // Draw tilemap
  drawTileMap(LEVEL_0, { x: 0, y: 0 })

  // Draw player
  const pooBearRect = prevPos[0] ?? { x, y }
  rectfill(
    { x: pooBearRect.x, y: pooBearRect.y, width, height },
    rgba(0, 255, 255, 255),
  )
  const playerRect = { x, y, width, height }
  const playerHitbox = { x: x + 4, y: y + 4, width: 8, height: 12 }
  const color = hasCollision(LEVEL_0, playerRect)
    ? rgba(0, 255, 0)
    : rgba(255, 0, 255)
  rectfill(playerRect, color)
  rectfill(playerHitbox, rgba(0, 0, 255))

  // Handle movement
  let nextHitbox = { ...playerHitbox }
  if (isButtonDown(Button.Up)) {
    nextHitbox.y--
  } else if (isButtonDown(Button.Down)) {
    nextHitbox.y++
  } else if (isButtonDown(Button.Left)) {
    nextHitbox.x--
  } else if (isButtonDown(Button.Right)) {
    nextHitbox.x++
  }
  if (nextHitbox.x !== playerHitbox.x || nextHitbox.y !== playerHitbox.y) {
    if (!hasCollision(LEVEL_0, nextHitbox)) {
      prevPos.push({ x, y })
      x = nextHitbox.x - Math.abs(playerRect.x - playerHitbox.x)
      y = nextHitbox.y - Math.abs(playerRect.y - playerHitbox.y)
    }
  }
  while (prevPos.length > 16) {
    prevPos.shift()
  }

  // Return to title
  if (isButtonPressed(Button.Start)) {
    console.log('dispatching from overworld')
    queue.push({
      type: EventType.ChangeScene,
      data: SceneType.Title,
    })
  }
}

export default update
