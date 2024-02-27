import { ContainerLike } from "@medusajs/types"

export function createContainerLike(obj): ContainerLike {
  return {
    resolve(key: string) {
      return obj[key]
    },
  }
}
