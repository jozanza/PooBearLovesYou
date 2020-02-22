import {
  StarshipUpdate,
  isButtonPressed,
  Button,
  playSound,
  drawSprite,
  Vector2,
  isButtonDown,
  Rectangle,
} from '@vsmode/starship'
import {
  Sound,
  Spritesheet,
  SPRITE_ANIMATIONS,
  Action,
  Direction,
} from '../assets'
import { SceneType } from '../scenes'
import { Event, EventType } from '../events'
import { State } from '../state'
import { tilemapOfString, drawTileMap, hasCollision } from '../tilemap'

const LEVEL_0 = tilemapOfString(`
l l . . . . . ' . . . . . . r r
. " ' * . . ' p t t . . . . ' l
. r " r . . . l . . r ' " . . .
. . p . . . . l . " . " . . * .
. . . . * l . ' . . . p r . . .
. . . . . . . . . . . r p . . .
" t . . . . . ╭ ╴ ╴ ╴ ╴ ╴ ╮ . .
* l . ' t p * ╷ ~ ~ ~ ~ ~ ╵ . t
. . ' " p . . ╰ ╶ ╶ ╶ ╶ ╶ ╯ t t
`)

interface Player {
  position: Vector2
  hitbox: Rectangle
  direction: Direction
  action: Action
}

const player: Player = {
  position: { x: 32, y: 32 },
  hitbox: { x: 4, y: 7, width: 8, height: 8 },
  direction: Direction.Down,
  action: Action.Idle,
}

const playerHistory: Player[] = []

let i = 0

const update: StarshipUpdate<State, Event> = (state, queue) => {
  if (state.scene.timer.entered === 0) {
    console.log('ENTERED SCENE')
  }

  // Play audio
  playSound(Sound.MainTheme)

  // Draw tilemap
  drawTileMap(LEVEL_0, { x: 0, y: 0 })

  // Draw PooBear
  {
    const pooBear = playerHistory[playerHistory.length - 1] ?? player
    const { x, y } = pooBear.position
    const { rate, frames, index } = SPRITE_ANIMATIONS[Spritesheet.Pet][
      player.action // mimic the player's action
    ][pooBear.direction]
    const srcX = index * 16
    const srcY = (Math.floor(i / rate) % frames) * 16
    drawSprite(
      Spritesheet.Pet,
      { x: srcX, y: srcY, width: 16, height: 16 },
      { x, y },
    )
  }

  // Draw player
  {
    const { x, y } = player.position
    const { rate, frames, index } = SPRITE_ANIMATIONS[Spritesheet.Player][
      player.action
    ][player.direction]
    const srcX = index * 16
    const srcY = (Math.floor(i / rate) % frames) * 16
    drawSprite(
      Spritesheet.Player,
      { x: srcX, y: srcY, width: 16, height: 16 },
      { x, y },
    )
    // NOTE: uncomment below to see player hitbox
    // const { x: x1, y: y1, width, height } = player.hitbox
    // rectfill({ x: x + x1, y: y + y1, width, height }, rgba(255, 0, 255, 200))
  }
  i++

  // Update Player
  {
    const { x: x0, y: y0 } = player.position
    const { x: x1, y: y1, width, height } = player.hitbox
    const x = x0 + x1
    const y = y0 + y1
    const nextHitbox = { x, y, width, height }
    const U = isButtonDown(Button.Up)
    const D = isButtonDown(Button.Down)
    const L = isButtonDown(Button.Left)
    const R = isButtonDown(Button.Right)
    const speed = 1.1
    const dspeed = speed * 0.6 // .5 feels too slow imho

    // diagonal
    if (U && R) {
      player.direction = Direction.Right
      nextHitbox.x += dspeed
      nextHitbox.y -= dspeed
    } else if (U && L) {
      player.direction = Direction.Left
      nextHitbox.x -= dspeed
      nextHitbox.y -= dspeed
    } else if (D && R) {
      player.direction = Direction.Right
      nextHitbox.x += dspeed
      nextHitbox.y += dspeed
    } else if (D && L) {
      player.direction = Direction.Left
      nextHitbox.x -= dspeed
      nextHitbox.y += dspeed
    }
    // cardinal
    else if (U) {
      player.direction = Direction.Up
      nextHitbox.y -= speed
    } else if (D) {
      player.direction = Direction.Down
      nextHitbox.y += speed
    } else if (L) {
      player.direction = Direction.Left
      nextHitbox.x -= speed
    } else if (R) {
      player.direction = Direction.Right
      nextHitbox.x += speed
    }

    // If trying to move...
    if (nextHitbox.x !== x || nextHitbox.y !== y) {
      // If no collision...
      if (!hasCollision(LEVEL_0, nextHitbox)) {
        // Track the last up-to 16 players
        playerHistory.unshift({ ...player })
        while (playerHistory.length > 16) {
          playerHistory.pop()
        }
        // Prepend the new position
        player.position = {
          x: nextHitbox.x - x1,
          y: nextHitbox.y - y1,
        }
      } else {
        // Play a noise when player hits a wall
        playSound(Sound.Bump)
      }
    }

    // Update player action
    const didMove = x0 !== player.position.x || y0 !== player.position.y
    player.action = didMove ? Action.Walking : Action.Idle
  }

  // Return to title
  if (isButtonPressed(Button.Start)) {
    queue.push({
      type: EventType.ChangeScene,
      data: SceneType.Title,
    })
  }
}

export default update
