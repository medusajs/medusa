export interface CancelOrderClaimWorkflowInput {
  claim_id: string
  no_notification?: boolean
  canceled_by?: string
}
