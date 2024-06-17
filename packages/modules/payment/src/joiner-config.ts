import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import {
  Payment,
  PaymentCollection,
  PaymentProvider,
  PaymentSession,
} from "@models"

export const LinkableKeys = {
  payment_id: Payment.name,
  payment_collection_id: PaymentCollection.name,
  payment_provider_id: PaymentProvider.name,
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
  serviceName: Modules.PAYMENT,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: ["payment", "payments"],
      args: {
        entity: Payment.name,
        methodSuffix: "Payments",
      },
    },
    {
      name: ["payment_collection", "payment_collections"],
      args: {
        entity: PaymentCollection.name,
      },
    },
    {
      name: ["payment_session", "payment_sessions"],
      args: {
        entity: PaymentSession.name,
        methodSuffix: "PaymentSessions",
      },
    },
    {
      name: ["payment_provider", "payment_providers"],
      args: {
        entity: PaymentProvider.name,
        methodSuffix: "PaymentProviders",
      },
    },
  ],
}
