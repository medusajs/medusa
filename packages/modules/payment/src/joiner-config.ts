import { Modules } from "@medusajs/modules-sdk"
import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
} from "@medusajs/utils"
import {
  Payment,
  PaymentCollection,
  PaymentProvider,
  PaymentSession,
} from "@models"

export const joinerConfig = defineJoinerConfig(Modules.PAYMENT, {
  entityQueryingConfig: [
    Payment,
    PaymentCollection,
    PaymentProvider,
    PaymentSession,
  ],
  linkableKeys: {
    payment_id: Payment.name,
    payment_collection_id: PaymentCollection.name,
    payment_provider_id: PaymentProvider.name,
  },
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
