import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import { Address, Customer, CustomerGroup } from "@models"

export const LinkableKeys = {
  customer_id: Customer.name,
  customer_group_id: CustomerGroup.name,
  customer_address_id: Address.name,
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
  alias: [
    {
      name: ["customer", "customers"],
      args: {
        entity: Customer.name,
      },
    },
    {
      name: ["customer_group", "customer_groups"],
      args: {
        entity: CustomerGroup.name,
        methodSuffix: "CustomerGroups",
      },
    },
    {
      name: ["customer_address", "customer_addresses"],
      args: {
        entity: Address.name,
        methodSuffix: "Addresses",
      },
    },
  ],
}
