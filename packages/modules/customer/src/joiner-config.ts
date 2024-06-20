import { Modules } from "@medusajs/modules-sdk"
import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
} from "@medusajs/utils"

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

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
