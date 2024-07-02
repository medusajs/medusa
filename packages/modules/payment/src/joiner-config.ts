import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
  Modules,
} from "@medusajs/utils"
import {
  Payment,
  PaymentCollection,
  PaymentProvider,
  PaymentSession,
} from "@models"

export const joinerConfig = defineJoinerConfig(Modules.PAYMENT, {
  dmlObjects: [Payment, PaymentCollection, PaymentProvider, PaymentSession],
  linkableKeys: {
    payment_id: Payment.name,
    payment_collection_id: PaymentCollection.name,
    payment_provider_id: PaymentProvider.name,
  },
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
