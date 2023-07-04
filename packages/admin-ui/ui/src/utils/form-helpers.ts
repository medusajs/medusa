import { DeepMap } from "react-hook-form"

export const stringOrNull = (value: string) => {
  return value === "" ? null : value
}

export const numberOrNull = (value: string) => {
  const tmp = parseInt(value, 10)

  return isNaN(tmp) ? null : tmp
}

export const checkForDirtyState = (
  dirtyFields: DeepMap<Record<string, any>, true>,
  otherValues: Record<string, boolean>
) => {
  const otherDirtyState = otherValues
    ? Object.values(otherValues).some((v) => v)
    : false

  return !!Object.keys(dirtyFields).length || otherDirtyState
}
