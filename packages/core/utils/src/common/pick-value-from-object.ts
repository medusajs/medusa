import { isObject } from "./is-object"

export function pickValueFromObject(
  path: string,
  object: Record<any, any>
): any {
  const segments = path.split(".")
  let result: any = undefined

  for (const segment of segments) {
    const segmentsLeft = [...segments].splice(1, segments.length - 1)
    const segmentOutput = object[segment]

    if (segmentsLeft.length === 0) {
      result = segmentOutput
      break
    }

    if (isObject(segmentOutput)) {
      result = pickValueFromObject(segmentsLeft.join("."), segmentOutput)
      break
    }

    if (Array.isArray(segmentOutput)) {
      result = segmentOutput
        .map((segmentOutput_) =>
          pickValueFromObject(segmentsLeft.join("."), segmentOutput_)
        )
        .flat()
      break
    }

    result = segmentOutput
  }

  return result
}
