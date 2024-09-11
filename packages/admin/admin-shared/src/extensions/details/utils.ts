import { CONTAINER_IDS } from "./constants"
import { ContainerId } from "./types"

export function isValidContainerId(id: any): id is ContainerId {
  return CONTAINER_IDS.includes(id)
}
