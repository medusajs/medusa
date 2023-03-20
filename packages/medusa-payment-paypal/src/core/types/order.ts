import { Links, PaymentSource, PurchaseUnit } from "./common"

export interface CreateOrder {
  intent: "CAPTURE" | "AUTHORIZE"
  purchase_units: Array<PurchaseUnit>
  payment_source?: PaymentSource
}

export interface CreateOrderResponse {
  id: string
  status: string
  payment_source: PaymentSource
  links: Links
}
