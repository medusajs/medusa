import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
  Modules,
} from "@medusajs/utils"
import { StockLocation } from "./models"

export const joinerConfig = defineJoinerConfig(Modules.STOCK_LOCATION, {
  linkableKeys: {
    stock_location_id: StockLocation.name,
    location_id: StockLocation.name,
  },
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
