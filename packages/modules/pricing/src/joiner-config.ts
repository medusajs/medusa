import { defineJoinerConfig, Modules } from "@medusajs/utils"
import { Price, PriceList, PricePreference, PriceSet } from "@models"

export const joinerConfig = defineJoinerConfig(Modules.PRICING, {
  models: [PriceSet, PriceList, Price, PricePreference],
})
