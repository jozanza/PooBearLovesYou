import { Entity } from '../common'

export function isOverlapping(
  target: Entity,
  collisionBounds: Entity,
): boolean {
  if (
    // target covers within left to right of collision bounds
    target.position.x + target.width > collisionBounds.position.x &&
    target.position.x < collisionBounds.position.x + collisionBounds.height &&
    // target covers within top to bottom of collision bounds
    target.position.y + target.height > collisionBounds.position.y &&
    target.position.y < collisionBounds.position.y + collisionBounds.height
  ) {
    return true
  }
  return false
}

export function isColliding(target: Entity, collisionBounds: Entity): boolean {
  if (
    // target covers within left to right of collision bounds
    target.position.x + target.width > collisionBounds.position.x &&
    target.position.x < collisionBounds.position.x + collisionBounds.height &&
    // target covers within top to bottom of collision bounds
    target.position.y + target.height > collisionBounds.position.y &&
    target.position.y < collisionBounds.position.y + collisionBounds.height
  ) {
    return true
  }
  return false
}

export enum CollisionDirection {
  None, // keep as first value so it's falsey
  Top,
  Right,
  Bottom,
  Left,
}

export function detectCollisionDirection(
  target: Entity,
  collisionBounds: Entity,
): CollisionDirection {
  if (isColliding(target, collisionBounds)) {
    if (target.position.x + target.width === collisionBounds.position.x + 1) {
      return CollisionDirection.Right
    }

    if (
      target.position.x ===
      collisionBounds.position.x - 1 + collisionBounds.width
    ) {
      return CollisionDirection.Left
    }

    if (target.position.y + target.height === collisionBounds.position.y + 1) {
      return CollisionDirection.Bottom
    }

    if (
      target.position.y ===
      collisionBounds.position.y - 1 + collisionBounds.height
    ) {
      return CollisionDirection.Top
    }
  }

  return CollisionDirection.None
}
