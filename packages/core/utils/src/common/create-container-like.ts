import { ContainerLike } from "@zjedene-medusa/types"

export function createContainerLike(obj): ContainerLike {
  return {
    resolve(
      key: string,
      {
        allowUnregistered = false,
      }: {
        allowUnregistered?: boolean
      } = {}
    ) {
      if (allowUnregistered) {
        try {
          return obj[key]
        } catch (error) {
          return undefined
        }
      }

      return obj[key]
    },
  }
}
