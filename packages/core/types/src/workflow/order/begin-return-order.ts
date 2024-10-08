export interface BeginOrderReturnWorkflowInput {
  order_id: string
  location_id?: string
  /**
   * The id of the user that creates the return
   */
  created_by?: string | null
  internal_note?: string
  description?: string
  metadata?: Record<string, unknown> | null
}
