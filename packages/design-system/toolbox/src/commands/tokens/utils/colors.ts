import { PaintType, type Color, type PaintGradient, type Vector } from "@/figma"
import { logger } from "@/logger"
import type { CSSProperties } from "react"

/**
 * Normalizes a color's opacity to a 0-1 range.
 * @param opacity The opacity to normalize.
 * @returns The normalized opacity.
 */
function normalizeOpacity(opacity?: number) {
  opacity = opacity !== undefined ? opacity : 1

  return Math.round(opacity * 100) / 100
}

/**
 * Normalizes a channel value to a 0-255 range.
 * @param value The channel value to normalize.
 * @returns The normalized channel value.
 */
function normalizeChannelValue(value: number) {
  return Math.round(value * 255)
}

/**
 * Converts a Color to an RGBA string.
 * @param color The color to convert to RGBA.
 * @param opacity The opacity to apply to the color.
 * @returns The RGBA string.
 */
function colorToRGBA(color: Color, opacity?: number): string {
  const red = normalizeChannelValue(color.r)
  const green = normalizeChannelValue(color.g)
  const blue = normalizeChannelValue(color.b)

  /**
   * How Figma returns opacity for colors is a bit weird.
   * They always return the alpha channel as 1, even if the color is less than solid.
   * Instead, they return the opacity in a seperate opacity property.
   * So we need to check if the opacity is defined, and if it is,
   * use that for the alpha channel instead.
   */
  const alpha =
    opacity !== undefined
      ? normalizeOpacity(opacity)
      : Math.round(color.a * 100) / 100

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

/**
 * Calculates the gradient degree of a gradient.
 * @param handlebarPositions The handlebar positions of the gradient.
 * @returns The gradient degree.
 */
function calculateGradientDegree(handlebarPositions: Vector[]): number {
  const startPoint = handlebarPositions[0]
  const endPoint = handlebarPositions[1]

  const angleRadians = Math.atan2(
    endPoint.y - startPoint.y,
    endPoint.x - startPoint.x
  )

  const angleDegrees = (angleRadians * 180) / Math.PI

  const normalizedAngleDegrees = (angleDegrees + 360) % 360

  // Rotate the angle by 90 degrees to get the correct angle for CSS gradients
  const rotatedAngleDegrees = normalizedAngleDegrees + 90

  return rotatedAngleDegrees
}

interface GradientValues {
  type: PaintType
}

interface LinearGradientValues extends GradientValues {
  type: PaintType.GRADIENT_LINEAR
  opacity: number
  degree: number
  from: string
  to: string
}

/**
 * Get the values of a linear gradient.
 * @param gradient
 * @returns
 */
function linearGradientValues(gradient: PaintGradient): LinearGradientValues {
  const opacity = normalizeOpacity(gradient.opacity) * 100
  const degree = calculateGradientDegree(gradient.gradientHandlePositions)
  const from = colorToRGBA(gradient.gradientStops[0].color)
  const to = colorToRGBA(gradient.gradientStops[1].color)

  return {
    type: gradient.type as PaintType.GRADIENT_LINEAR,
    opacity,
    degree,
    from,
    to,
  }
}

interface CreateGradientComponentProps {
  type: PaintType
}

interface CreateLinearGradientComponentProps
  extends CreateGradientComponentProps {
  type: PaintType.GRADIENT_LINEAR
  degree: number
  from: string
  to: string
  opacity: number
}

/**
 * Create a CSSProperties object for a linear gradient.
 * @param props
 * @returns
 */
function createLinearGradientComponent({
  degree,
  from,
  to,
  opacity,
}: CreateLinearGradientComponentProps): CSSProperties {
  return {
    backgroundImage: `linear-gradient(${degree}deg, var(${from}), var(${to}))`,
    opacity: `${opacity}%`,
  }
}

/**
 * Get the values of a gradient based on its type.
 * @param gradient
 * @returns
 */
function gradientValues(gradient: PaintGradient) {
  if (gradient.type === PaintType.GRADIENT_LINEAR) {
    return linearGradientValues(gradient)
  }

  logger.warn(`The gradient type "${gradient.type}" is not supported.`)
  return null
}

export { colorToRGBA, createLinearGradientComponent, gradientValues }
