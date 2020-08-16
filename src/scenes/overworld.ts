import {
  StarshipUpdate,
  isButtonPressed,
  Button,
  playSound,
  drawSprite,
  Vector2,
  isButtonDown,
  Rectangle,
  drawFilledRect,
  rgba,
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
import { drawTileMap, willCollide } from '../tilemap'
import { LEVEL_0 } from '../levels'

const BLACK = rgba(0, 0, 0, 255)
const RED = rgba(255, 0, 0, 255)
const GREEN = rgba(0, 255, 0, 255)
const YELLOW = rgba(255, 255, 0, 255)

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

function randomEntry<T>(xs: Array<T>): T {
  return xs[randomInt(0, xs.length - 1)]
}

interface Player {
  position: Vector2
  hitbox: Rectangle
  direction: Direction
  action: Action
}

function createPlayer() {
  return {
    position: { x: 32, y: 32 },
    hitbox: { x: 4, y: 7, width: 8, height: 8 },
    direction: Direction.Down,
    action: Action.Idle,
  }
}

export enum Food {
  Cherry = 0,
  Banana = 1,
  Apple = 2,
  Blueberry = 3,
  Plum = 4,
  Raspberry = 5,
}

const allFoods = [
  Food.Cherry,
  Food.Banana,
  Food.Apple,
  Food.Blueberry,
  Food.Plum,
  Food.Raspberry,
]

interface FoodData {
  type: Food
  pos: { x: number; y: number }
}

interface PooBear {
  hp: number
  maxHP: number
  wants: FoodData[]
}

const openTiles = [
  { x: 3, y: 3 },
  { x: 14, y: 7 },
  { x: 0, y: 6 },
  { x: 5, y: 8 },
  { x: 9, y: 2 },
  { x: 14, y: 1 },
  { x: 0, y: 1 },
  { x: 13, y: 5 },
].map(({ x, y }) => ({ x: 16 * x, y: 16 * y }))

function createPooBear(): PooBear {
  let spots = new Set()
  return {
    hp: 32,
    maxHP: 32,
    wants: Array(3)
      .fill(0)
      .map(() => {
        let pos = randomEntry(openTiles)
        while (spots.has(pos)) {
          pos = randomEntry(openTiles)
        }
        spots.add(pos)
        return {
          type: randomEntry(allFoods),
          pos,
        }
      }),
  }
}

let Player: Player = createPlayer()
let PooBear: PooBear = createPooBear()
let playerHistory: Player[] = []
let i = 0

const update: StarshipUpdate<State, Event> = (state, queue) => {
  if (state.scene.timer.entered === 0) {
    console.log('ENTERED SCENE')
    Player = createPlayer()
    PooBear = createPooBear()
    playerHistory = []
  }

  // Play audio
  playSound(Sound.MainTheme)

  // Draw tilemap
  drawTileMap(LEVEL_0, { x: 0, y: 0 })

  // Draw Food
  for (const food of PooBear.wants) {
    drawSprite(
      Spritesheet.Food,
      {
        x: 16 * food.type,
        y: 0,
        width: 16,
        height: 16,
      },
      food.pos,
    )
    break
  }

  // Draw Player & PooBear
  {
    const pooBear = playerHistory[playerHistory.length - 1] ?? Player
    const { x, y } = pooBear.position
    const { rate, frames, index } = SPRITE_ANIMATIONS[Spritesheet.Pet][
      Player.action // mimic the player's action
    ][pooBear.direction]
    const srcX = index * 16
    const srcY = (Math.floor(i / rate) % frames) * 16
    drawSprite(
      Spritesheet.Pet,
      { x: srcX, y: srcY, width: 16, height: 16 },
      { x, y },
    )
    // Draw player
    {
      const { x, y } = Player.position
      const { rate, frames, index } = SPRITE_ANIMATIONS[Spritesheet.Player][
        Player.action
      ][Player.direction]
      const srcX = index * 16
      const srcY = (Math.floor(i / rate) % frames) * 16
      drawSprite(
        Spritesheet.Player,
        { x: srcX, y: srcY, width: 16, height: 16 },
        { x, y },
      )
      // NOTE: uncomment below to see player hitbox
      // const { x: x1, y: y1, width, height } = Player.hitbox
      // rectfill({ x: x + x1, y: y + y1, width, height }, rgba(255, 0, 255, 200))
    }
    const [food] = PooBear.wants
    if (food) {
      drawSprite(
        Spritesheet.Food,
        { x: 16 * 22, y: 0, width: 16, height: 16 },
        { x, y: y - 16 },
      )
      drawSprite(
        Spritesheet.Food,
        { x: 16 * food.type, y: 0, width: 16, height: 16 },
        { x, y: y - 17 },
      )
    }
  }

  // Draw Poo Bear's HP bar
  {
    const width = 48
    const height = 8
    const x = 128 - width / 2
    const y = 144 - height * 2
    const { maxHP, hp } = PooBear
    if (i % 12 === 0 && hp > 0) {
      PooBear.hp--
    }
    const percent = hp / maxHP
    drawFilledRect({ x, y, width, height }, BLACK)
    drawFilledRect(
      {
        x: x + height / 4,
        y: y + height / 4,
        width: Math.floor((width - height / 2) * percent),
        height: height - height / 2,
      },
      percent <= 0.25 ? RED : percent <= 0.5 ? YELLOW : GREEN,
    )
  }

  // Update frame
  i++

  // Update Player
  {
    const { x: x0, y: y0 } = Player.position
    const { x: x1, y: y1, width, height } = Player.hitbox
    const x = x0 + x1
    const y = y0 + y1
    const hitbox = { x, y, width, height }
    const U = isButtonDown(Button.Up)
    const D = isButtonDown(Button.Down)
    const L = isButtonDown(Button.Left)
    const R = isButtonDown(Button.Right)
    const speed = 1.1
    const dspeed = speed * 0.6 // .5 feels too slow imho

    // diagonal
    if (U && R) {
      Player.direction = Direction.Right
      if (!willCollide(LEVEL_0, hitbox, 0, -speed)) {
        hitbox.y -= speed
      }
      if (!willCollide(LEVEL_0, hitbox, dspeed, 0)) {
        hitbox.x += dspeed
      }
    } else if (U && L) {
      Player.direction = Direction.Left
      if (!willCollide(LEVEL_0, hitbox, 0, -speed)) {
        hitbox.y -= speed
      }
      if (!willCollide(LEVEL_0, hitbox, -dspeed, 0)) {
        hitbox.x -= dspeed
      }
    } else if (D && R) {
      Player.direction = Direction.Right
      if (!willCollide(LEVEL_0, hitbox, 0, speed)) {
        hitbox.y += speed
      }
      if (!willCollide(LEVEL_0, hitbox, dspeed, 0)) {
        hitbox.x += dspeed
      }
    } else if (D && L) {
      Player.direction = Direction.Left
      if (!willCollide(LEVEL_0, hitbox, 0, speed)) {
        hitbox.y += speed
      }
      if (!willCollide(LEVEL_0, hitbox, -dspeed, 0)) {
        hitbox.x -= dspeed
      }
    }
    // cardinal
    else if (U) {
      Player.direction = Direction.Up
      if (!willCollide(LEVEL_0, hitbox, 0, -speed)) {
        hitbox.y -= speed
      }
    } else if (D) {
      Player.direction = Direction.Down
      if (!willCollide(LEVEL_0, hitbox, 0, speed)) {
        hitbox.y += speed
      }
    } else if (L) {
      Player.direction = Direction.Left
      if (!willCollide(LEVEL_0, hitbox, -speed, 0)) {
        hitbox.x -= speed
      }
    } else if (R) {
      Player.direction = Direction.Right
      if (!willCollide(LEVEL_0, hitbox, speed, 0)) {
        hitbox.x += speed
      }
    }

    // Update player action
    const didMove = hitbox.x !== x || hitbox.y !== y
    if (didMove) {
      // Track the last up-to 16 players
      playerHistory.unshift({ ...Player })
      while (playerHistory.length > 16) {
        playerHistory.pop()
      }
      // Prepend the new position
      Player.position = {
        x: hitbox.x - x1,
        y: hitbox.y - y1,
      }
      Player.action = Action.Walking

      // Check if player is on a fruit
      for (const food of PooBear.wants) {
        if (hitbox.x >= food.pos.x && hitbox.x < food.pos.x + 16) {
          if (hitbox.y >= food.pos.y && hitbox.y < food.pos.y + 16) {
            PooBear.wants.shift()
            PooBear.hp = PooBear.maxHP
          }
        }
        break
      }
    } else {
      Player.action = Action.Idle
    }
  }

  // Return to title
  if (isButtonPressed(Button.Start)) {
    queue.push({
      type: EventType.ChangeScene,
      data: SceneType.Title,
    })
  }

  // Victory
  if (!PooBear.wants.length) {
    queue.push({
      type: EventType.ChangeScene,
      data: SceneType.Victory,
    })
  }

  // Game Over
  if (!PooBear.hp) {
    queue.push({
      type: EventType.ChangeScene,
      data: SceneType.GameOver,
    })
  }
}

export default update
