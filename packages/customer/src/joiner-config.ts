import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import { Customer, CustomerGroup } from "@models"

export const LinkableKeys = {
  customer_id: Customer.name,
  customer_group_id: CustomerGroup.name,
}

const entityLinkableKeysMap: MapToConfig = {}
Object.entries(LinkableKeys).forEach(([key, value]) => {
  entityLinkableKeysMap[value] ??= []
  entityLinkableKeysMap[value].push({
    mapTo: key,
    valueFrom: key.split("_").pop()!,
  })
})

export const entityNameToLinkableKeysMap: MapToConfig = entityLinkableKeysMap

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.CUSTOMER,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: {
    name: ["customer", "customers"],
    args: {
      entity: Customer.name,
    },
  },
}
