import { Links, PaymentSource, PurchaseUnit } from "./common"

export interface CreateOrder {
  intent: "CAPTURE" | "AUTHORIZE"
  purchase_units: Array<PurchaseUnit>
  payment_source?: PaymentSource
}

export interface CreateOrderResponse {
  id: string
  status:
    | "CREATED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "COMPLETED"
    | "PAYER_ACTION_REQUIRED"
  payment_source?: PaymentSource
  links?: Links
  intent?: CreateOrder["intent"]
  processing_instruction?:
    | "ORDER_COMPLETE_ON_PAYMENT_APPROVAL"
    | "NO_INSTRUCTION"
  purchase_units: Array<PurchaseUnit>
  create_time?: string
  update_time?: string
}

/* eslint @typescript-eslint/no-empty-interface: "off" */
export interface GetOrderResponse extends CreateOrderResponse {}

export interface PatchOrder {
  op: "replace" | "add" | "remove"
  path: string
  value:
    | CreateOrder["intent"]
    | PurchaseUnit
    | { client_configuration?: any }
    | Record<string, unknown>
}
