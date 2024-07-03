import { defineJoinerConfig, Modules } from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.CUSTOMER, {
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
