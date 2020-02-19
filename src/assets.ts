export enum Font {
  Small = `/assets/fonts/baby.png`,
  Medium = `/assets/fonts/thicc.png`,
}

export enum Sound {
  MainTheme = `/assets/sounds/main-theme.mp3`,
  Bump = `/assets/sounds/bump.mp3`,
}

export enum Spritesheet {
  Environment = `/assets/sprites/environment.png`,
  Food = `/assets/sprites/food.png`,
  Pet = `/assets/sprites/pet.png`,
  Player = `/assets/sprites/player.png`,
}

enum AnimationRate {
  Slow = 64,
  Comfy = 32,
  Normal = 16,
  Fast = 8,
  SkrrtSkrrt = 4,
}

type SpriteAnimation = {
  index: number
  frames: number
  rate: AnimationRate
}

const 〱 = (index: number, frames: number, rate: AnimationRate) => {
  const animation: SpriteAnimation = {
    index,
    frames,
    rate,
  }
  return animation
}

export enum Action {
  Idle,
  Walking,
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export const SPRITE_ANIMATIONS = {
  // prettier-ignore
  [Spritesheet.Player]: {
    [Action.Idle]: {
      [Direction.Left]:  〱(0, 2, AnimationRate.Comfy),
      [Direction.Right]: 〱(1, 2, AnimationRate.Comfy),
      [Direction.Down]:  〱(2, 2, AnimationRate.Comfy),
      [Direction.Up]:    〱(3, 2, AnimationRate.Comfy),
    },
    [Action.Walking]: {
      [Direction.Left]:  〱(4, 8, AnimationRate.SkrrtSkrrt),
      [Direction.Right]: 〱(5, 8, AnimationRate.SkrrtSkrrt),
      [Direction.Down]:  〱(6, 8, AnimationRate.Fast),
      [Direction.Up]:    〱(7, 8, AnimationRate.Fast),
    }
  },
  // prettier-ignore
  [Spritesheet.Pet]: {
    [Action.Idle]: {
      [Direction.Left]:  〱(0, 2, AnimationRate.Comfy),
      [Direction.Right]: 〱(1, 2, AnimationRate.Comfy),
      [Direction.Down]:  〱(2, 2, AnimationRate.Comfy),
      [Direction.Up]:    〱(3, 2, AnimationRate.Comfy),
    },
    [Action.Walking]: {
      [Direction.Left]:  〱(4, 8, AnimationRate.SkrrtSkrrt),
      [Direction.Right]: 〱(5, 8, AnimationRate.SkrrtSkrrt),
      [Direction.Down]:  〱(6, 8, AnimationRate.Fast),
      [Direction.Up]:    〱(7, 8, AnimationRate.Fast),
    }
  }
}
