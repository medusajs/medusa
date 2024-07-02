import { defineJoinerConfig, Modules } from "@medusajs/utils"
import { Price, PriceList, PriceSet } from "@models"

export const joinerConfig = defineJoinerConfig(Modules.PRICING, {
  models: [PriceSet, PriceList, Price],
  linkableKeys: {
    price_set_id: PriceSet.name,
    price_list_id: PriceList.name,
    price_id: Price.name,
  },
})
