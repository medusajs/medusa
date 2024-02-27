import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"
import { StockLocation } from "./models"
import moduleSchema from "./schema"

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.STOCK_LOCATION,
  primaryKeys: ["id"],
  linkableKeys: {
    stock_location_id: StockLocation.name,
    location_id: StockLocation.name,
  },
  schema: moduleSchema,
  alias: [
    {
      name: ["stock_location", "stock_locations"],
      args: {
        entity: "StockLocation",
      },
    },
  ],
}
