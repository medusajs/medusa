export interface BeginOrderReturnWorkflowInput {
  order_id: string
  location_id?: string
  created_by?: string
  internal_note?: string
  description?: string
  metadata?: Record<string, unknown> | null
}
