export interface CancelOrderFulfillmentWorkflowInput {
  order_id: string
  fulfillment_id: string
  no_notification?: boolean
}
