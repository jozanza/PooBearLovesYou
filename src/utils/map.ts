import { createEnvironment } from '../entities/environment'
import { EnvironmentKind } from '../common'

// Environment Sprites
const G1 = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.GrassOne, { x, y })
const G2 = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.GrassTwo, { x, y })
const G3 = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.GrassThree, { x, y })
const G4 = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.GrassFour, { x, y })
const T = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.Tree, { x, y })
const WB = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.WaterBottom, { x, y })
const WBL = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.WaterBottomLeft, { x, y })
const WBR = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.WaterBottomRight, { x, y })
const WC = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.WaterCenter, { x, y })
const WL = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.WaterLeft, { x, y })
const WR = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.WaterRight, { x, y })
const WT = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.WaterTop, { x, y })
const WTL = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.WaterTopLeft, { x, y })
const WTR = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.WaterTopRight, { x, y })
const R = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.Rock, { x, y })
const L = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.Log, { x, y })
const PB = (x: number, y: number) =>
  createEnvironment(EnvironmentKind.Pebbles, { x, y })

type Map = Array<Array<0 | Function>>

// 256 / 16 = 16
// 144 / 16 = 9
const map: Map = [
  [L, L, G1, G1, G1, G1, G1, G3, G1, G1, G1, G1, G1, G1, R, R],
  [G1, G2, G3, G4, G1, G1, G3, PB, T, T, G1, G1, G1, G1, G3, L],
  [G1, R, G2, R, G1, G1, G1, L, G1, G4, R, G3, G2, G1, G1, G1],
  [G1, G1, PB, G1, G1, G1, G1, L, G1, G3, G1, G2, G1, G1, G4, G1],
  [G1, G1, G1, G1, G4, L, G1, G2, G1 /*P*/, G1, G1, PB, R, G1, G1, G1],
  [G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, R, PB, G1, G1, G1],
  [G3, T, G1, G1, G1, G1, G1, WTL, WT, WT, WT, WT, WT, WTR, G1, G1],
  [G4, L, G1, G3, T, PB, G4, WL, WC, WC, WC, WC, WC, WR, G1, T],
  [G1, G1, G3, G2, PB, G1, G1, WBL, WB, WB, WB, WB, WB, WBR, T, T],
]

export default map
