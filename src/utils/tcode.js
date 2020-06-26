import { clampedNum } from './clamp'

// constructs tcode strings for channel/value combos (0 <= value <= 0.999)
export const tCode = (channel, value) => {
  if (value < 0) value = 0
  if (value > 0.999) value = 0.999
  const scaledValue = Math.floor(value * 1000)
  const paddedValue = String(scaledValue).padStart(3, '0')
  return channel + paddedValue
}

// assumes interval in seconds, convert to tcode string
export const intervalTCode = interval => {
  // convert interval to 1-9999 ms
  const millisecondInterval = clampedNum(Math.floor(interval * 1000), 1, 9999)
  const paddedInterval = String(millisecondInterval).padStart(4, '0')
  return 'I' + String(paddedInterval)
}

// return tcode for all supplied axes in destination, with interval if supplied
export const constructTCodeCommand = (destination, interval) => {
  // create tcode for each axis we have
  const commands = Object.keys(destination).map(
    axis =>
      tCode(axis, destination[axis]) + (interval ? intervalTCode(interval) : '')
  )

  return commands.join(' ')
}

// given axial movement and output range, scales outputs to the range
export const scaleAxes = (axes, outputRange) => {
  const {
    L0Min,
    L0Max,
    L1Min,
    L1Max,
    L2Min,
    L2Max,
    R0Min,
    R0Max,
    R1Min,
    R1Max,
    R2Min,
    R2Max,
    V0Min,
    V0Max,
    V1Min,
    V1Max,
    V2Min,
    V2Max,
  } = outputRange
  return {
    ...(axes.L0 && { L0: L0Min + axes.L0 * (L0Max - L0Min) }),
    ...(axes.L1 && { L1: L1Min + axes.L1 * (L1Max - L1Min) }),
    ...(axes.L2 && { L2: L2Min + axes.L2 * (L2Max - L2Min) }),
    ...(axes.R0 && { R0: R0Min + axes.R0 * (R0Max - R0Min) }),
    ...(axes.R1 && { R1: R1Min + axes.R1 * (R1Max - R1Min) }),
    ...(axes.R2 && { R2: R2Min + axes.R2 * (R2Max - R2Min) }),
    ...(axes.V0 && { V0: V0Min + axes.V0 * (V0Max - V0Min) }),
    ...(axes.V1 && { V1: V1Min + axes.V1 * (V1Max - V1Min) }),
    ...(axes.V2 && { V2: V2Min + axes.V2 * (V2Max - V2Min) }),
  }
}