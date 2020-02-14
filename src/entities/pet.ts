import { Spritesheet, PetEntity, Food, EntityType } from '../common'
import { sprite } from '../starship'
import getAnimation, { AnimationReference } from '../utils/getAnimation'
import counter from '../utils/counter'

export enum AnimationName {
  IdleDown = 'IdleDown',
  IdleLeft = 'IdleLeft',
  IdleRight = 'IdleRight',
  IdleUp = 'IdleUp',
  WalkDown = 'WalkDown',
  WalkLeft = 'WalkLeft',
  WalkRight = 'WalkRight',
  WalkUp = 'WalkUp',
}

const ANIMATION_REFERENCES: { [key in AnimationName]: AnimationReference } = {
  // idle down, frame#2, 2 frames
  [AnimationName.IdleDown]: {
    index: 2,
    numFrames: 2,
  },
  // idle left, frame#0, 2 frames
  [AnimationName.IdleLeft]: {
    index: 0,
    numFrames: 2,
  },
  // idle right, frame#4, 2 frames
  [AnimationName.IdleRight]: {
    index: 4,
    numFrames: 2,
  },
  // idle up, frame#6, 2 frames
  [AnimationName.IdleUp]: {
    index: 6,
    numFrames: 2,
  },
  // walk down, frame#16, 8 frames
  [AnimationName.WalkDown]: {
    index: 16,
    numFrames: 8,
  },
  // walk left, frame#8, 8 frames
  [AnimationName.WalkLeft]: {
    index: 8,
    numFrames: 8,
  },
  // walk right, frame#24, 8 frames
  [AnimationName.WalkRight]: {
    index: 24,
    numFrames: 8,
  },
  // walk up, frame#32, 8 frames
  [AnimationName.WalkUp]: {
    index: 32,
    numFrames: 8,
  },
}

const spriteData = {
  animationName: AnimationName.IdleDown,
  nextIdleAnimationName: AnimationName.IdleDown,
  animations: {
    [AnimationName.IdleLeft]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.IdleLeft],
      {
        durationPerFrame: 32,
      },
    ),
    [AnimationName.IdleDown]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.IdleDown],
      {
        durationPerFrame: 32,
      },
    ),

    [AnimationName.IdleRight]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.IdleRight],
      {
        durationPerFrame: 32,
      },
    ),

    [AnimationName.IdleUp]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.IdleUp],
      {
        durationPerFrame: 32,
      },
    ),
    [AnimationName.WalkLeft]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.WalkLeft],
      {
        durationPerFrame: 4,
      },
    ),
    [AnimationName.WalkDown]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.WalkDown],
      {
        durationPerFrame: 4,
      },
    ),
    [AnimationName.WalkRight]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.WalkRight],
      {
        durationPerFrame: 4,
      },
    ),
    [AnimationName.WalkUp]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.WalkUp],
      {
        durationPerFrame: 4,
      },
    ),
  },
}

export function createPet(x: number = 0, y: number = 0): PetEntity {
  return {
    type: EntityType.Pet,
    id: counter(),
    width: 16,
    height: 16,
    position: { x, y },
    spriteData,
    wants: [],
    hp: 100,
    maxHP: 100,
  }
}

export function drawPet(pet: PetEntity) {
  const { position, spriteData } = pet
  const anim = spriteData.animations[spriteData.animationName]
  const data = anim.frames[anim.index]

  sprite(Spritesheet.Pet, data.rect, position)
  const [kind] = pet.wants
  if (kind) {
    sprite(
      Spritesheet.Food,
      {
        x: 352,
        y: 0,
        width: 16,
        height: 16,
      },
      { x: position.x, y: position.y - 16 },
    )
    let x = 0
    switch (kind) {
      case Food.Cherry:
        x = 0
        break
      case Food.Banana:
        x = 16
        break
      case Food.Apple:
        x = 32
        break
      case Food.Blueberry:
        x = 48
        break
      case Food.Plum:
        x = 64
        break
      case Food.Raspberry:
        x = 80
        break
    }
    sprite(
      Spritesheet.Food,
      {
        x,
        y: 0,
        width: 16,
        height: 16,
      },
      { x: position.x, y: position.y - 16 },
    )
  }
  anim.counter++
  if (anim.counter % data.duration === 0) {
    anim.index = (anim.index + 1) % anim.frames.length
  }
}
