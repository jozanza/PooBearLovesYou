import { StarshipSubscribe } from './starship'
import {
  GameState,
  EntityType,
  Entity,
  PetEntity,
  PlayerEntity,
} from './common'
import { AnimationName } from './entities/player'

export enum ActionType {
  MOVE_PLAYER_DOWN,
  MOVE_PLAYER_LEFT,
  MOVE_PLAYER_RIGHT,
  MOVE_PLAYER_UP,
  STOP_PLAYER_MOVEMENT,
  MOVE_PET,
}

export type Actions =
  | {
      type: ActionType.MOVE_PLAYER_DOWN
      data: { id: number }
    }
  | {
      type: ActionType.MOVE_PLAYER_LEFT
      data: { id: number }
    }
  | {
      type: ActionType.MOVE_PLAYER_RIGHT
      data: { id: number }
    }
  | {
      type: ActionType.MOVE_PLAYER_UP
      data: { id: number }
    }
  | {
      type: ActionType.STOP_PLAYER_MOVEMENT
      data: { id: number }
    }
  | {
      type: ActionType.MOVE_PET
      data: { id: number }
    }

function castEntity<T extends Entity>(x: Entity | void): T | void {
  if (x) {
    return x as T
  }
}

function findEntity<T extends Entity>(state: GameState, id: number) {
  return castEntity<T>(state.entities.get(id))
}

export const subscribe: StarshipSubscribe<GameState, Actions> = (
  state,
  action,
) => {
  switch (action.type) {
    case ActionType.MOVE_PLAYER_DOWN: {
      const player = findEntity<PlayerEntity>(state, action.data.id)
      if (player) {
        player.spriteData.animationName = AnimationName.WalkDown
        player.spriteData.nextIdleAnimationName = AnimationName.IdleDown
        state.hasMoved = true
        player.position.y++
      }
      break
    }
    case ActionType.MOVE_PLAYER_LEFT: {
      const player = findEntity<PlayerEntity>(state, action.data.id)
      if (player) {
        player.spriteData.animationName = AnimationName.WalkLeft
        player.spriteData.nextIdleAnimationName = AnimationName.IdleLeft
        state.hasMoved = true
        player.position.x--
      }
      break
    }
    case ActionType.MOVE_PLAYER_RIGHT: {
      const player = findEntity<PlayerEntity>(state, action.data.id)
      if (player) {
        player.spriteData.animationName = AnimationName.WalkRight
        player.spriteData.nextIdleAnimationName = AnimationName.IdleRight
        state.hasMoved = true
        player.position.x++
      }
      break
    }
    case ActionType.MOVE_PLAYER_UP: {
      const player = findEntity<PlayerEntity>(state, action.data.id)
      if (player) {
        player.spriteData.animationName = AnimationName.WalkUp
        player.spriteData.nextIdleAnimationName = AnimationName.IdleUp
        state.hasMoved = true
        player.position.y--
      }
      break
    }
    case ActionType.STOP_PLAYER_MOVEMENT: {
      const player = findEntity<PlayerEntity>(state, action.data.id)
      if (player) {
        player.spriteData.animationName =
          player.spriteData.nextIdleAnimationName
      }
      break
    }
    case ActionType.MOVE_PET: {
      const pet = findEntity<PetEntity>(state, action.data.id)
      const player = findEntity<PlayerEntity>(state, state.playerId)
      if (!pet || !player) break
      const shouldMoveX =
        Math.abs(player.position.x - pet.position.x) > player.width
      const shouldMoveY =
        Math.abs(player.position.y - pet.position.y) > player.height
      if (pet && pet.type === EntityType.Pet) {
        if (!shouldMoveX && !shouldMoveY) {
          pet.spriteData.animationName = pet.spriteData.nextIdleAnimationName
          break
        }
        if (shouldMoveX) {
          if (player.position.x > pet.position.x) {
            // right
            pet.spriteData.animationName = AnimationName.WalkRight
            pet.spriteData.nextIdleAnimationName = AnimationName.IdleRight
            pet.position.x++
          } else {
            // left
            pet.spriteData.animationName = AnimationName.WalkLeft
            pet.spriteData.nextIdleAnimationName = AnimationName.IdleLeft
            pet.position.x--
          }
        }
        if (shouldMoveY) {
          if (player.position.y > pet.position.y) {
            // below
            pet.spriteData.animationName = AnimationName.WalkDown
            pet.spriteData.nextIdleAnimationName = AnimationName.IdleDown
            pet.position.y++
          } else {
            // above
            pet.spriteData.animationName = AnimationName.WalkUp
            pet.spriteData.nextIdleAnimationName = AnimationName.IdleUp
            pet.position.y--
          }
        }
      }
      break
    }
  }
}
