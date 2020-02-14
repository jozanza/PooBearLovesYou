export interface AnimationReference {
  index: number
  numFrames: number
}

export interface AnimationOptions {
  size?: number
  durationPerFrame: number
}

function getAnimationFrames(
  startIndex: number,
  numFrames: number,
  { durationPerFrame, size = 16 }: AnimationOptions,
) {
  let frames = []

  for (let i = 0; i < numFrames; i++) {
    frames.push({
      rect: {
        x: startIndex * size + i * size,
        y: 0,
        width: size,
        height: size,
      },
      duration: durationPerFrame,
    })
  }

  return frames
}

export default function getAnimation(
  animationRef: AnimationReference,
  options: AnimationOptions,
) {
  const { index, numFrames } = animationRef

  return {
    index: 0,
    counter: 0,
    frames: getAnimationFrames(index, numFrames, options),
  }
}
