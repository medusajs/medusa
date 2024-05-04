import {
  Effect,
  EffectBlur,
  EffectShadow,
  EffectType,
  Paint,
  PaintGradient,
  PaintImage,
  PaintSolid,
  PaintType,
} from "./types"

export function isEffectShadow(effect: Effect): effect is EffectShadow {
  return (
    effect.type === EffectType.DROP_SHADOW ||
    effect.type === EffectType.INNER_SHADOW
  )
}

export function isEffectBlur(effect: Effect): effect is EffectBlur {
  return (
    effect.type === EffectType.BACKGROUND_BLUR ||
    effect.type === EffectType.LAYER_BLUR
  )
}

export function isPaintSolid(paint: Paint): paint is PaintSolid {
  return paint.type === PaintType.SOLID
}

export function isPaintGradient(paint: Paint): paint is PaintGradient {
  return (
    paint.type === PaintType.GRADIENT_ANGULAR ||
    paint.type === PaintType.GRADIENT_DIAMOND ||
    paint.type === PaintType.GRADIENT_LINEAR ||
    paint.type === PaintType.GRADIENT_RADIAL
  )
}

export function isPaintImage(paint: Paint): paint is PaintImage {
  return paint.type === PaintType.IMAGE
}
