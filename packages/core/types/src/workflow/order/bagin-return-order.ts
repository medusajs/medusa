export interface beginOrderReturnWorkflowInput {
  order_id: string
  created_by?: string | null // The id of the authenticated user
  note?: string | null
}
