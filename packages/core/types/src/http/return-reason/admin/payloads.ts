type AdminBaseReturnReasonPayload = {
  value: string
  label: string
  description?: string
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateReturnReason extends AdminBaseReturnReasonPayload {
  parent_return_reason_id?: string
}

export interface AdminUpdateReturnReason extends AdminBaseReturnReasonPayload {}
