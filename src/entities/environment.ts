import {
  Spritesheet,
  EntityType,
  EnvironmentEntity,
  EnvironmentKind,
  Position,
} from '../common'
import counter from '../utils/counter'
import getAnimation from '../utils/getAnimation'
import { sprite } from '../starship'

const WATER_FRAME_DURATION = 120

const ENTITY_INFO = {
  [EnvironmentKind.GrassOne]: {
    isCollidable: false,
    animation: getAnimation(
      { index: 0, numFrames: 1 },
      { durationPerFrame: 32 },
    ),
  },
  [EnvironmentKind.GrassTwo]: {
    isCollidable: false,
    animation: getAnimation(
      { index: 1, numFrames: 1 },
      { durationPerFrame: 32 },
    ),
  },
  [EnvironmentKind.GrassThree]: {
    isCollidable: false,
    animation: getAnimation(
      { index: 2, numFrames: 1 },
      { durationPerFrame: 32 },
    ),
  },
  [EnvironmentKind.GrassFour]: {
    isCollidable: false,
    animation: getAnimation(
      { index: 3, numFrames: 1 },
      { durationPerFrame: 32 },
    ),
  },
  [EnvironmentKind.Tree]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 22, numFrames: 2 },
      { durationPerFrame: 240 },
    ),
  },
  [EnvironmentKind.WaterBottom]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 14, numFrames: 2 },
      { durationPerFrame: WATER_FRAME_DURATION },
    ),
  },
  [EnvironmentKind.WaterBottomLeft]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 16, numFrames: 2 },
      { durationPerFrame: WATER_FRAME_DURATION },
    ),
  },
  [EnvironmentKind.WaterBottomRight]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 12, numFrames: 2 },
      { durationPerFrame: WATER_FRAME_DURATION },
    ),
  },
  [EnvironmentKind.WaterCenter]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 20, numFrames: 2 },
      { durationPerFrame: WATER_FRAME_DURATION },
    ),
  },
  [EnvironmentKind.WaterLeft]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 18, numFrames: 2 },
      { durationPerFrame: WATER_FRAME_DURATION },
    ),
  },
  [EnvironmentKind.WaterRight]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 10, numFrames: 2 },
      { durationPerFrame: WATER_FRAME_DURATION },
    ),
  },
  [EnvironmentKind.WaterTop]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 6, numFrames: 2 },
      { durationPerFrame: WATER_FRAME_DURATION },
    ),
  },
  [EnvironmentKind.WaterTopLeft]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 4, numFrames: 2 },
      { durationPerFrame: WATER_FRAME_DURATION },
    ),
  },
  [EnvironmentKind.WaterTopRight]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 8, numFrames: 2 },
      { durationPerFrame: WATER_FRAME_DURATION },
    ),
  },
  [EnvironmentKind.Rock]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 24, numFrames: 1 },
      { durationPerFrame: 32 },
    ),
  },
  [EnvironmentKind.Log]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 25, numFrames: 1 },
      { durationPerFrame: 32 },
    ),
  },
  [EnvironmentKind.Pebbles]: {
    isCollidable: true,
    animation: getAnimation(
      { index: 26, numFrames: 1 },
      { durationPerFrame: 32 },
    ),
  },
}

function getSpriteData(kind: EnvironmentKind) {
  return {
    animationName: kind,
    animations: {
      [kind]: ENTITY_INFO[kind].animation,
    },
  }
}

export function createEnvironment(
  kind: EnvironmentKind,
  position: Position,
): EnvironmentEntity {
  return {
    type: EntityType.Environment,
    kind,
    id: counter(),
    width: 16,
    height: 16,
    position,
    spriteData: getSpriteData(kind),
    isCollidable: ENTITY_INFO[kind].isCollidable,
  }
}

export function drawEnvironment(environment: EnvironmentEntity) {
  const { position, spriteData } = environment
  const anim = spriteData.animations[spriteData.animationName]
  const data = anim.frames[anim.index]

  sprite(Spritesheet.Environment, data.rect, position)

  anim.counter++
  if (anim.counter % data.duration === 0) {
    anim.index = (anim.index + 1) % anim.frames.length
  }
}
