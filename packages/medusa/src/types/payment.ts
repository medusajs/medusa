export type CreateSessionContext = {
  cart: {
    context: Record<string, unknown>
    id: string
    customer_id?: string
    email: string
  }
  shipping_options: {} // to be defined
  customer?: { id: string; metadata: Record<string, unknown> }
  currency_code: string
  amount: number
  resource_id?: string
}

export type PaymentContext = {
  cart: {
    context: Record<string, unknown>
    id: string
    customer_id?: string
    email: string
  }
  currency_code: string
  amount: number
  resource_id?: string
  // Data previously collected and stored on the customer
  colledcted_data: Record<string, unknown>
}

export type PaymentSessionResponse<TPaymentSessionData = unknown> =
  CollectedData & {
    session_data: TPaymentSessionData
  }

export type CollectedData<TCollectedData = any> = {
  collected_data?: TCollectedData
}

export interface PaymentPluginError {
  error: string
  code: number
  details: any
}
