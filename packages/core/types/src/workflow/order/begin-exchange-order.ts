export interface BeginOrderExchangeWorkflowInput {
  order_id: string
  /**
   * The id of the user that creates the order exchange
   */
  created_by?: string | null
  internal_note?: string
  description?: string
  metadata?: Record<string, unknown> | null
}
