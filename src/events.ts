import { SceneType } from './scenes'

export enum EventType {
  Noop,
  ChangeScene,
}

export type Event =
  | { type: EventType.Noop }
  | { type: EventType.ChangeScene; data: SceneType }
