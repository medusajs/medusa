import { defineJoinerConfig, Modules } from "@medusajs/utils"
import Address from "./models/address"

export const joinerConfig = defineJoinerConfig(Modules.CUSTOMER, {
  models: [Address],
  alias: [
    {
      name: ["customer_address", "customer_addresses"],
      args: {
        entity: "Address",
        methodSuffix: "Addresses",
      },
    },
  ],
})
