import { Modules } from "@medusajs/modules-sdk"
import { JoinerServiceConfig } from "@medusajs/types"

export const joinerConfig: JoinerServiceConfig = {
  serviceName: Modules.STOCK_LOCATION,
  primaryKeys: ["id"],
  alias: [
    {
      name: "stock_location",
    },
    {
      name: "stock_locations",
    },
  ],
}
