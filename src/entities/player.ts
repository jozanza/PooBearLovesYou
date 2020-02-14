import { Spritesheet, EntityType, PlayerEntity } from '../common'
import counter from '../utils/counter'
import getAnimation, { AnimationReference } from '../utils/getAnimation'
import { sprite } from '../starship'

export enum AnimationName {
  IdleDown = 'IdleDown',
  IdleLeft = 'IdleLeft',
  IdleRight = 'IdleRight',
  IdleUp = 'IdleUp',
  WalkDown = 'WalkDown',
  WalkLeft = 'WalkLeft',
  WalkRight = 'WalkRight',
  WalkUp = 'WalkUp',
  CollectDown = 'CollectDown',
  CollectLeft = 'CollectLeft',
  CollectRight = 'CollectRight',
  CollectUp = 'CollectUp',
}

const ANIMATION_REFERENCES: { [key in AnimationName]: AnimationReference } = {
  [AnimationName.IdleDown]: {
    index: 2,
    numFrames: 2,
  },
  [AnimationName.IdleLeft]: {
    index: 0,
    numFrames: 2,
  },
  [AnimationName.IdleRight]: {
    index: 4,
    numFrames: 2,
  },
  [AnimationName.IdleUp]: {
    index: 6,
    numFrames: 2,
  },
  [AnimationName.WalkDown]: {
    index: 16,
    numFrames: 8,
  },
  [AnimationName.WalkLeft]: {
    index: 8,
    numFrames: 8,
  },
  [AnimationName.WalkRight]: {
    index: 24,
    numFrames: 8,
  },
  [AnimationName.WalkUp]: {
    index: 32,
    numFrames: 8,
  },
  [AnimationName.CollectDown]: {
    index: 2,
    numFrames: 2,
  },
  [AnimationName.CollectLeft]: {
    index: 0,
    numFrames: 2,
  },
  [AnimationName.CollectRight]: {
    index: 4,
    numFrames: 2,
  },
  [AnimationName.CollectUp]: {
    index: 6,
    numFrames: 2,
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
    [AnimationName.CollectLeft]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.CollectLeft],
      {
        durationPerFrame: 6,
      },
    ),
    [AnimationName.CollectDown]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.CollectDown],
      {
        durationPerFrame: 6,
      },
    ),

    [AnimationName.CollectRight]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.CollectRight],
      {
        durationPerFrame: 6,
      },
    ),

    [AnimationName.CollectUp]: getAnimation(
      ANIMATION_REFERENCES[AnimationName.CollectUp],
      {
        durationPerFrame: 6,
      },
    ),
  },
}

export function createPlayer(x: number = 0, y: number = 0): PlayerEntity {
  return {
    type: EntityType.Player,
    id: counter(),
    width: 16,
    height: 16,
    position: { x, y },
    spriteData: {
      ...spriteData,
    },
  }
}

export function drawPlayer(player: PlayerEntity) {
  const { position, spriteData } = player
  const anim = spriteData.animations[spriteData.animationName]
  const data = anim.frames[anim.index]

  sprite(Spritesheet.Player, data.rect, position)
  // print(Font.Small, JSON.stringify(player.position), { x: 0, y: 0 })

  anim.counter++
  if (anim.counter % data.duration === 0) {
    anim.index = (anim.index + 1) % anim.frames.length
  }
}
