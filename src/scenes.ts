export enum SceneType {
  Title,
  Overworld,
  GameOver,
  Victory,
}

type MakeScene<T extends SceneType, V extends object = {}> = {
  type: T
  timer: {
    entered: number
    leaving: number
  }
} & V

export type Scene =
  | MakeScene<SceneType.Title>
  | MakeScene<SceneType.Overworld>
  | MakeScene<SceneType.GameOver>
  | MakeScene<SceneType.Victory>

export function createScene(type: SceneType): Scene {
  return {
    type,
    timer: {
      entered: 0,
      leaving: Infinity,
    },
  }
}
