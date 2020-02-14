import {
  StarshipConfig,
  StarshipDispatch,
  // gfx
  rgba,
  clear,
  print,
  rectfill,
  // io
  Button,
  isButtonDown,
  isButtonPressed,
  // audio
  playSound,
  isSoundPlaying,
  run,
} from './starship'
import {
  TILE_SIZE,
  Font,
  Sound,
  GameState,
  SceneType,
  EntityType,
  PlayerEntity,
  Position,
  Food,
  PetEntity,
} from './common'
import { Actions, ActionType, subscribe } from './actions'
import { createPlayer, drawPlayer } from './entities/player'
import { drawObstacle } from './entities/obstacle'
import { drawPet, createPet } from './entities/pet'
import { drawEnvironment } from './entities/environment'
import { drawFood, createFood } from './entities/food'
import {
  detectCollisionDirection,
  CollisionDirection,
  isColliding,
} from './utils/collision'
import map from './utils/map'

// Game configuration options
const config: StarshipConfig<GameState, Actions> = {
  title: 'Poo Bear Loves You <3',
  window: { x: 512, y: 512 },
  canvas: { x: 256, y: 144 },
  fps: 60,
  init,
  update,
  subscribe,
}

run(config)

const black = rgba(0, 0, 0, 255)
const red = rgba(255, 0, 0, 255)

// initial game state
function init(): GameState {
  const entities: GameState['entities'] = new Map()

  let initPlayer: () => PlayerEntity = () => {
    const player = createPlayer(128, 64)
    entities.set(player.id, player)
    return player
  }

  map.forEach((rows, rowIndex) => {
    const y = rowIndex * TILE_SIZE

    rows.forEach((createEntity, columnIndex) => {
      const x = columnIndex * TILE_SIZE

      // make sure player is drawn last so it's on top of all entities
      if (createEntity === createPlayer) {
        initPlayer = () => {
          const player = createPlayer(x, y)
          entities.set(player.id, player)
          return player
        }
        return
      }

      if (typeof createEntity === 'function') {
        const entity = createEntity(x, y)
        entities.set(entity.id, entity)
      }
    })
  })

  // Add Player
  const player = initPlayer()

  // Add Food
  const foods = [
    Food.Apple,
    Food.Banana,
    Food.Blueberry,
    Food.Cherry,
    Food.Plum,
    Food.Raspberry,
  ]
  let coords: Position[] = [
    { x: 2, y: 2 },
    { x: 14, y: 7 },
    { x: 0, y: 6 },
    { x: 5, y: 8 },
    { x: 9, y: 2 },
    { x: 14, y: 1 },
    { x: 0, y: 1 },
    { x: 13, y: 5 },
  ]
  let wants: Food[] = []
  const numFoods = 3
  for (let i = 0; i < numFoods; i++) {
    const kind = foods[Math.floor(Math.random() * foods.length)]
    const [{ x, y }] = coords.splice(
      Math.floor(Math.random() * coords.length),
      1,
    )
    wants.push(kind)
    const food = createFood(x * TILE_SIZE, y * TILE_SIZE, kind)
    if (i === 0) food.visible = true
    entities.set(food.id, food)
  }

  // Add Pet
  const pet = createPet(player.position.x, player.position.y - TILE_SIZE)
  pet.wants = wants
  entities.set(pet.id, pet)

  // Initial state
  return {
    scene: {
      type: SceneType.Title,
    },
    entities,
    playerId: player.id,
    petId: pet.id,
    frame: 0,
    hasMoved: false,
  }
}

// Runs once per frame
function update(state: GameState, dispatch: StarshipDispatch<Actions>) {
  // Loop BGM
  if (!isSoundPlaying(Sound.MainTheme)) playSound(Sound.MainTheme)

  // Draw graphics + update entities
  clear()

  if (state.scene.type === SceneType.Title) {
    // console.log(state.frame)
    print(Font.Medium, `POO BEAR LOVES YOU <3`, { x: 8, y: 8 })
    print(
      Font.Small,
      `\n` +
        `INSTRUCTIONS:\n` +
        `\n` +
        ` Poo Bear is hungry. You must feed Poo Bear.\n` +
        ` Bring him food he likes, and he will love you.\n` +
        `\n` +
        `\n` +
        `CONTROLS:\n` +
        `\n` +
        ` - UP:    move up\n` +
        ` - DOWN:  move down\n` +
        ` - LEFT:  move left\n` +
        ` - RIGHT: move right\n`,
      {
        x: 8,
        y: 24,
      },
    )
    if (state.frame % 64 < 32) {
      print(Font.Medium, `press start`, { x: 86, y: config.canvas.y - 24 })
    }
    if (isButtonPressed(Button.Start)) {
      state.scene = { type: SceneType.OverWorld }
      state.frame = 0
    } else {
      state.frame++
    }
    return
  } else {
    if (isButtonPressed(Button.A)) {
      Object.assign(state, init())
    }
  }

  for (const [id, entity] of state.entities) {
    switch (entity.type) {
      case EntityType.Player:
        {
          const player = entity
          drawPlayer(player)
          let didMove = false
          let collisionDirection

          for (const [, entity] of state.entities) {
            if (entity.id !== player.id && entity.isCollidable) {
              collisionDirection = detectCollisionDirection(player, entity)
              if (collisionDirection) {
                didMove = false
                break
              }
            }
          }

          // Movement
          if (
            isButtonDown(Button.Up) &&
            collisionDirection !== CollisionDirection.Top
          ) {
            didMove = true
            dispatch({
              type: ActionType.MOVE_PLAYER_UP,
              data: { id },
            })
          }

          if (
            isButtonDown(Button.Down) &&
            collisionDirection !== CollisionDirection.Bottom
          ) {
            didMove = true
            dispatch({
              type: ActionType.MOVE_PLAYER_DOWN,
              data: { id },
            })
          }

          if (
            isButtonDown(Button.Left) &&
            collisionDirection !== CollisionDirection.Left
          ) {
            didMove = true
            dispatch({
              type: ActionType.MOVE_PLAYER_LEFT,
              data: { id },
            })
          }

          if (
            isButtonDown(Button.Right) &&
            collisionDirection !== CollisionDirection.Right
          ) {
            didMove = true
            dispatch({
              type: ActionType.MOVE_PLAYER_RIGHT,
              data: { id },
            })
          }
          if (!didMove) {
            dispatch({
              type: ActionType.STOP_PLAYER_MOVEMENT,
              data: { id },
            })
          }
        }
        break

      case EntityType.Obstacle:
        drawObstacle(entity)
        break

      case EntityType.Food:
        if (entity.visible) {
          drawFood(entity)
          const pet = state.entities.get(state.petId) as PetEntity
          const [kind] = pet.wants
          if (entity.kind !== kind) break
          const player = state.entities.get(state.playerId) as PlayerEntity
          if (isColliding(entity, player)) {
            pet.wants.shift()
            pet.hp = pet.maxHP
            state.entities.delete(id)
            if (!pet.wants.length) break
            for (const [, e] of state.entities) {
              if (e.type === EntityType.Food && e.kind === kind) {
                e.visible = true
                break
              }
            }
          }
        }
        break

      case EntityType.Pet:
        {
          drawPet(entity)
          const { hp, maxHP, wants } = entity
          // No longer hungies
          if (!wants.length) {
            print(Font.Medium, 'CONGRATS!', { x: 9, y: 9 }, black)
            print(Font.Medium, 'CONGRATS!', { x: 8, y: 8 })
            print(
              Font.Small,
              'You "repaired" your relationship with Poo Bear!',
              {
                x: 9,
                y: 25,
              },
              black,
            )
            print(
              Font.Small,
              'You "repaired" your relationship with Poo Bear!',
              {
                x: 8,
                y: 24,
              },
            )
            // Reset game
            if (state.frame % 64 < 32) {
              print(
                Font.Medium,
                `press start`,
                {
                  x: 87,
                  y: config.canvas.y - 23,
                },
                black,
              )
              print(Font.Medium, `press start`, {
                x: 86,
                y: config.canvas.y - 24,
              })
            }
            if (isButtonPressed(Button.Start)) {
              // RESET
              Object.assign(state, init())
            }
            break
          }
          // Died
          if (!hp) {
            print(Font.Medium, 'Oh no!', { x: 9, y: 9 }, black)
            print(Font.Medium, 'Oh no!', { x: 8, y: 8 })
            print(
              Font.Small,
              `You didn't feed Poo Bear in time! :(\n`,
              {
                x: 9,
                y: 25,
              },
              black,
            )
            print(Font.Small, `You didn't feed Poo Bear in time! :(\n`, {
              x: 8,
              y: 24,
            })
            // Reset game
            if (state.frame % 64 < 32) {
              print(
                Font.Medium,
                `press start`,
                {
                  x: 87,
                  y: config.canvas.y - 23,
                },
                black,
              )
              print(Font.Medium, `press start`, {
                x: 86,
                y: config.canvas.y - 24,
              })
            }
            if (isButtonPressed(Button.Start)) {
              // RESET
              Object.assign(state, init())
            }
            break
          }
          // Business as usual
          const width = 64
          const height = 16
          let x = config.canvas.x / 2 - width / 2
          let y = config.canvas.y - height
          // HP bar
          rectfill({ x, y, width, height }, rgba(0, 0, 0, 255))
          rectfill(
            {
              x: x + 4,
              y: y + 4,
              width: (width - 8) * (hp / maxHP),
              height: height - 8,
            },
            red,
          )
          // Chases slowly after the player
          if (state.frame % 2 === 0) {
            if (state.hasMoved) {
              entity.hp -= 0.5
            }
            dispatch({
              type: ActionType.MOVE_PET,
              data: { id },
            })
          }
          // Takes a dump every so often
          if (state.frame > 0 && state.frame % 64 === 0) {
            // TODO: lay turd
            // dispatch({
            //   type: ActionType.LAY_TURD,
            //   data: { id },
            // })
          }
        }
        break

      case EntityType.Environment:
        drawEnvironment(entity)
        break
    }
  }
  state.frame++
}
