import { CONTAINER_IDS, PRODUCT_CONTAINER_IDS } from "./constants"

export type ContainerId = (typeof CONTAINER_IDS)[number]

export type EntityContainerMap = {
  product: (typeof PRODUCT_CONTAINER_IDS)[number]
}
