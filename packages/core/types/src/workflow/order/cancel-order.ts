export interface CancelOrderWorkflowInput {
  order_id: string
  no_notification?: boolean
  canceled_by?: string
}
