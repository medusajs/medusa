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
