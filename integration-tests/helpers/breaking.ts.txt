export const breaking = (
  v1Fn: (() => any) | null,
  v2Fn?: (() => any) | null
) => {
  if (process.env.MEDUSA_FF_MEDUSA_V2 === "true") {
    return v2Fn?.()
  }

  return v1Fn?.()
}
