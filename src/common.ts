import { Rectangle, Vector2 } from './starship'

export const TILE_SIZE = 16

export enum Font {
  Small = '/fonts/baby.png',
  Medium = '/fonts/thicc.png',
}

export enum Sound {
  MainTheme = '/audio/main-theme.mp3',
}

export enum Spritesheet {
  Environment = '/images/environment.png',
  Food = '/images/food.png',
  Pet = '/images/pet.png',
  Player = '/images/player.png',
}

export type Position = Vector2

export interface SpriteAnimationFrame {
  rect: Rectangle
  duration: number
}

export interface SpriteAnimation {
  index: number
  counter: number
  frames: SpriteAnimationFrame[]
}

export interface SpriteData {
  animationName: string
  nextIdleAnimationName?: string
  animations: {
    [key: string]: SpriteAnimation
  }
}

export enum EntityType {
  Player,
  Obstacle,
  Food,
  Pet,
  Environment,
}

export interface EntityCommonTraits {
  type: EntityType
  id: number
  width: number
  height: number
  position: Position
  spriteData: SpriteData
  isCollidable?: boolean
}

export interface PlayerEntity extends EntityCommonTraits {
  type: EntityType.Player
}

export interface ObstacleEntity extends EntityCommonTraits {
  type: EntityType.Obstacle
}

export interface EnvironmentEntity extends EntityCommonTraits {
  type: EntityType.Environment
}

export enum Food {
  Cherry = 'Cherry',
  Banana = 'Banana',
  Apple = 'Apple',
  Blueberry = 'Blueberry',
  Plum = 'Plum',
  Raspberry = 'Raspberry',
}

export enum EnvironmentKind {
  GrassOne = 'GrassOne',
  GrassTwo = 'GrassTwo',
  GrassThree = 'GrassThree',
  GrassFour = 'GrassFour',
  Tree = 'Tree',
  WaterBottom = 'WaterBottom',
  WaterBottomLeft = 'WaterBottomLeft',
  WaterBottomRight = 'WaterBottomRight',
  WaterCenter = 'WaterCenter',
  WaterLeft = 'WaterLeft',
  WaterRight = 'WaterRight',
  WaterTop = 'WaterTop',
  WaterTopLeft = 'WaterTopLeft',
  WaterTopRight = 'WaterTopRight',
  Rock = 'Rock',
  Log = 'Log',
  Pebbles = 'Pebbles',
}

export interface FoodEntity extends EntityCommonTraits {
  type: EntityType.Food
  kind: Food
  visible: boolean
}

export interface EnvironmentEntity extends EntityCommonTraits {
  type: EntityType.Environment
  kind: EnvironmentKind
}

export interface PetEntity extends EntityCommonTraits {
  type: EntityType.Pet
  wants: Food[]
  hp: number // happy points
  maxHP: number
}

export type Entity =
  | PlayerEntity
  | ObstacleEntity
  | FoodEntity
  | PetEntity
  | EnvironmentEntity

export enum SceneType {
  Title,
  OverWorld,
}

export type Scene =
  | {
      type: SceneType.Title
    }
  | {
      type: SceneType.OverWorld
    }

export interface MovementSummary {
  animationName: string
  nextIdleAnimationName?: string
  position: Position
}

export interface GameState {
  scene: Scene
  entities: Map<number, Entity>
  playerId: number
  petId: number
  frame: number
  hasMoved: boolean
}
