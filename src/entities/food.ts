import {
  Spritesheet,
  FoodEntity,
  Food,
  SpriteData,
  EntityType,
} from '../common'
import { sprite } from '../starship'
import counter from '../utils/counter'

const spriteData: { [key: string]: SpriteData } = {
  [Food.Cherry]: {
    animationName: '',
    animations: {
      '': {
        index: 0,
        counter: 0,
        frames: [
          {
            rect: {
              x: 0,
              y: 0,
              width: 16,
              height: 16,
            },
            duration: 1,
          },
        ],
      },
    },
  },
  [Food.Banana]: {
    animationName: '',
    animations: {
      '': {
        index: 0,
        counter: 0,
        frames: [
          {
            rect: {
              x: 16,
              y: 0,
              width: 16,
              height: 16,
            },
            duration: 1,
          },
        ],
      },
    },
  },
  [Food.Apple]: {
    animationName: '',
    animations: {
      '': {
        index: 0,
        counter: 0,
        frames: [
          {
            rect: {
              x: 32,
              y: 0,
              width: 16,
              height: 16,
            },
            duration: 1,
          },
        ],
      },
    },
  },
  [Food.Blueberry]: {
    animationName: '',
    animations: {
      '': {
        index: 0,
        counter: 0,
        frames: [
          {
            rect: {
              x: 48,
              y: 0,
              width: 16,
              height: 16,
            },
            duration: 1,
          },
        ],
      },
    },
  },
  [Food.Plum]: {
    animationName: '',
    animations: {
      '': {
        index: 0,
        counter: 0,
        frames: [
          {
            rect: {
              x: 64,
              y: 0,
              width: 16,
              height: 16,
            },
            duration: 1,
          },
        ],
      },
    },
  },
  [Food.Raspberry]: {
    animationName: '',
    animations: {
      '': {
        index: 0,
        counter: 0,
        frames: [
          {
            rect: {
              x: 80,
              y: 0,
              width: 16,
              height: 16,
            },
            duration: 1,
          },
        ],
      },
    },
  },
}

export function createFood(
  x: number = 0,
  y: number = 0,
  kind: Food,
): FoodEntity {
  return {
    type: EntityType.Food,
    id: counter(),
    width: 16,
    height: 16,
    position: { x, y },
    spriteData: { ...spriteData[kind] },
    kind,
    visible: true,
  }
}

export function drawFood(food: FoodEntity) {
  const { position, spriteData } = food
  const anim = spriteData.animations[spriteData.animationName]
  const data = anim.frames[anim.index]

  sprite(Spritesheet.Food, data.rect, position)
  // print(Font.Medium, JSON.stringify(position), { x: 64, y: 0 })
}
