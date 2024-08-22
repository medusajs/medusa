export interface AdminCapturePayment {
  amount?: number
}

export interface AdminRefundPayment {
  amount?: number
  refund_reason_id?: string | null
  note?: string | null
}

export interface AdminCreateRefundReason {
  label: string
  description?: string
}

export interface AdminCreatePaymentCollection {
  order_id: string
  amount?: number
}

export interface AdminMarkPaymentCollectionAsPaid {
  order_id: string
}
