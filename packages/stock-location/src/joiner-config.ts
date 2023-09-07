import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.STOCK_LOCATION,
  primaryKeys: ["id"],
  linkableKeys: ["stock_location_id"],
  alias: [
    {
      name: "stock_location",
    },
    {
      name: "stock_locations",
    },
  ],
}
