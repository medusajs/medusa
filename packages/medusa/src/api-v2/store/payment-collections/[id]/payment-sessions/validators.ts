import { PaymentProviderContext } from "@medusajs/types"

export class StorePostPaymentCollectionsPaymentSessionReq {
  provider_id: string
  context?: PaymentProviderContext
  data?: Record<string, unknown>
}
