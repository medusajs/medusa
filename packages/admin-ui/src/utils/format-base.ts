import { Base } from "../types"

export const formatBase = <T extends string>(base?: T): Base<T> => {
  if (!base) {
    return undefined
  }

  return `/${base}/`
}
