import { Vector2, sprite, Rectangle } from './starship'
import { Spritesheet } from './assets'

enum TileType {
  Grass1,
  Grass2,
  Grass3,
  Grass4,
  Tree,
  Log,
  Rock,
  Pebbles,
  WaterTopLeft,
  WaterTop,
  WaterTopRight,
  WaterRight,
  WaterBottomRight,
  WaterBottom,
  WaterBottomLeft,
  WaterLeft,
  WaterMiddle,
}

interface SpriteAnimation {
  rate: number
  frames: number
}

type MakeTile<T extends TileType> = {
  type: T
  pos: Vector2
  animation: SpriteAnimation
  solid: boolean
}

// TODO: convert to enums (TileSize, AnimationRate)
const TILE_SIZE = 16
const FAST_RATE = 16
const MEDIUM_RATE = 32
const SLOW_RATE = 64

function makeTile<T extends TileType>(
  type: T,
  x: number,
  rate: number = 0,
  frames: number = 1,
  solid: boolean = false,
): MakeTile<T> {
  return {
    type,
    pos: {
      x: x * TILE_SIZE,
      y: 0,
    },
    solid,
    animation: { rate, frames },
  }
}

// prettier-ignore
const TILES = {
  [TileType.Grass1]: makeTile(TileType.Grass1, 0),
  [TileType.Grass2]: makeTile(TileType.Grass2, 1),
  [TileType.Grass3]: makeTile(TileType.Grass3, 2),
  [TileType.Grass4]: makeTile(TileType.Grass4, 3),
  [TileType.Tree]: makeTile(TileType.Tree, 13, MEDIUM_RATE, 2, true),
  [TileType.Log]: makeTile(TileType.Log, 15, undefined, undefined, true),
  [TileType.Rock]: makeTile(TileType.Rock, 14, undefined, undefined, true),
  [TileType.Pebbles]: makeTile(TileType.Pebbles, 16, undefined, undefined, true),
  [TileType.WaterTopLeft]: makeTile(TileType.WaterTopLeft, 4, SLOW_RATE, 2, true),
  [TileType.WaterTop]: makeTile(TileType.WaterTop, 5, SLOW_RATE, 2, true),
  [TileType.WaterTopRight]: makeTile(TileType.WaterTopRight, 6, SLOW_RATE, 2, true),
  [TileType.WaterRight]: makeTile(TileType.WaterRight, 7, SLOW_RATE, 2, true),
  [TileType.WaterBottomRight]: makeTile(TileType.WaterBottomRight, 11, SLOW_RATE, 2, true),
  [TileType.WaterBottom]: makeTile(TileType.WaterBottom, 10, SLOW_RATE, 2, true),
  [TileType.WaterBottomLeft]: makeTile(TileType.WaterBottomLeft, 9, SLOW_RATE, 2, true),
  [TileType.WaterLeft]: makeTile(TileType.WaterLeft, 8, SLOW_RATE, 2, true),
  [TileType.WaterMiddle]: makeTile(TileType.WaterMiddle, 12, SLOW_RATE, 2, true),
}

const LEGEND: { [key: string]: TileType } = {
  [`.`]: TileType.Grass1,
  [`'`]: TileType.Grass2,
  [`"`]: TileType.Grass3,
  [`*`]: TileType.Grass4,
  [`t`]: TileType.Tree,
  [`l`]: TileType.Log,
  [`r`]: TileType.Rock,
  [`p`]: TileType.Pebbles,
  [`╭`]: TileType.WaterTopLeft,
  [`╴`]: TileType.WaterTop,
  [`╮`]: TileType.WaterTopRight,
  [`╵`]: TileType.WaterRight,
  [`╯`]: TileType.WaterBottomRight,
  [`╶`]: TileType.WaterBottom,
  [`╰`]: TileType.WaterBottomLeft,
  [`╷`]: TileType.WaterLeft,
  [`~`]: TileType.WaterMiddle,
}

export interface Tilemap {
  size: Vector2
  src: Spritesheet
  tiles: TileType[]
  frame: number
}

export function tilemapOfString(str: string): Tilemap {
  const tiles: TileType[] = []
  let x = 0
  let y = 1
  for (const char of str.trim()) {
    if (!LEGEND.hasOwnProperty(char)) {
      if (char === '\n') y++
      continue
    }
    if (y === 1) x++
    const type = LEGEND[char]
    tiles.push(type)
  }
  return {
    size: { x, y },
    src: Spritesheet.Environment,
    tiles,
    frame: 0,
  }
}

export function getTileType(
  tilemap: Tilemap,
  { x, y }: Vector2,
): TileType | null {
  return tilemap.tiles[x + tilemap.size.x * y] ?? null
}

export function hasCollision(tilemap: Tilemap, rect: Rectangle) {
  const x0 = Math.floor(rect.x / TILE_SIZE)
  const x1 = Math.floor((rect.x + rect.width) / TILE_SIZE)
  const y0 = Math.floor(rect.y / TILE_SIZE)
  const y1 = Math.floor((rect.y + rect.height) / TILE_SIZE)
  const positions = [
    { x: x0, y: y0 }, // top-left
    { x: x1, y: y0 }, // top-right
    { x: x1, y: y1 }, // bottom-right
    { x: x0, y: y1 }, // bottom-left
  ]
  // Check each positionn for a collision
  for (const pos of positions) {
    const type = getTileType(tilemap, pos)
    if (type && TILES[type].solid) return true
  }
  return false
}

export function drawTileMap(tilemap: Tilemap, origin: Vector2) {
  const width = TILE_SIZE,
    height = TILE_SIZE
  const { x: cols, y: rows } = tilemap.size
  let i = 0
  for (const type of tilemap.tiles) {
    const tile = TILES[type]
    const { rate, frames } = tile.animation
    const frame = Math.floor((tilemap.frame / rate) % frames) || 0
    const { x, y } = tile.pos
    const col = i % cols
    const row = Math.floor(i / cols) % rows
    sprite(
      tilemap.src,
      { x, y: y + frame * height, width, height },
      {
        x: origin.x + col * width,
        y: origin.y + row * height,
      },
    )
    i++
  }
  tilemap.frame++
}
