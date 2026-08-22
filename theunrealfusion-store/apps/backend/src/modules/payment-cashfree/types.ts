export type CashfreeOptions = {
  appId?: string
  secretKey?: string
  environment?: "sandbox" | "production"
  apiVersion?: string
}

export type CashfreeCustomerDetails = {
  customer_id: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
}

export type CashfreeOrderMeta = {
  return_url?: string
  notify_url?: string
  payment_methods?: string
}

export type CashfreeCreateOrderPayload = {
  order_id: string
  order_amount: number
  order_currency: string
  customer_details: CashfreeCustomerDetails
  order_meta?: CashfreeOrderMeta
  order_note?: string
  order_tags?: Record<string, string>
}

export type CashfreeOrderResponse = {
  cf_order_id?: number | string
  order_id: string
  order_amount: number
  order_currency: string
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED"
  payment_session_id?: string
  order_expiry_time?: string
  customer_details?: CashfreeCustomerDetails
  payments?: {
    url?: string
  }
  settlements?: {
    url?: string
  }
  refunds?: {
    url?: string
  }
}
