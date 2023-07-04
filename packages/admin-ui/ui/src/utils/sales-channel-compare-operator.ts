import { SalesChannel } from "@medusajs/medusa"

export const defaultChannelsSorter =
  (defaultSalesChanenlId: string) => (sc1: SalesChannel, sc2: SalesChannel) => {
    if (sc1.id === defaultSalesChanenlId) {
      return -1
    }
    if (sc2.id === defaultSalesChanenlId) {
      return 1
    }

    return sc1.name.localeCompare(sc2.name)
  }
