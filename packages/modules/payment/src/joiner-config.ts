import { defineJoinerConfig, Modules } from "@zjedene-medusa/framework/utils"
import {
  AccountHolder,
  Payment,
  PaymentCollection,
  PaymentProvider,
  RefundReason,
} from "@models"

export const joinerConfig = defineJoinerConfig(Modules.PAYMENT, {
  linkableKeys: {
    payment_id: Payment.name,
    payment_collection_id: PaymentCollection.name,
    payment_provider_id: PaymentProvider.name,
    refund_reason_id: RefundReason.name,
    account_holder_id: AccountHolder.name,
  },
  alias: [
    {
      name: ["payment_method", "payment_methods"],
      entity: "PaymentMethod",
      args: {
        methodSuffix: "PaymentMethods",
      },
    },
  ],
})
