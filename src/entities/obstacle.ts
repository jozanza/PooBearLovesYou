import { EntityType, ObstacleEntity } from '../common'
import counter from '../utils/counter'
import { rectfill } from '../starship'

export enum AnimationName {
  Idle = 'idle',
}

const spriteData = {
  animationName: AnimationName.Idle,
  animations: {
    [AnimationName.Idle]: {
      index: 0,
      counter: 0,
      frames: [
        {
          rect: {
            x: 32,
            y: 32,
            width: 16,
            height: 16,
          },
          duration: 1,
        },
      ],
    },
  },
}

export function createObstacle(x: number = 0, y: number = 0): ObstacleEntity {
  return {
    type: EntityType.Obstacle,
    id: counter(),
    width: 16,
    height: 16,
    position: { x, y },
    spriteData: {
      ...spriteData,
    },
  }
}

export function drawObstacle(obstacle: ObstacleEntity) {
  const { width, height, position, spriteData } = obstacle
  const anim = spriteData.animations[spriteData.animationName]
  const data = anim.frames[anim.index]
  rectfill(
    {
      ...position,
      width,
      height,
    },
    { r: 255, g: 255, b: 255, a: 255 },
  )
}
