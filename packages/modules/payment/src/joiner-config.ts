import { defineJoinerConfig, Modules } from "@medusajs/utils"
import {
  Payment,
  PaymentCollection,
  PaymentProvider,
  PaymentSession,
} from "@models"

export const joinerConfig = defineJoinerConfig(Modules.PAYMENT, {
  models: [Payment, PaymentCollection, PaymentProvider, PaymentSession],
  linkableKeys: {
    payment_id: Payment.name,
    payment_collection_id: PaymentCollection.name,
    payment_provider_id: PaymentProvider.name,
  },
})
