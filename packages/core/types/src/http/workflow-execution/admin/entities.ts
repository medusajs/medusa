export interface AdminWorkflowExecution {
  id: string
  workflow_id: string
  transaction_id: string
  execution: string
  context: string
  state: any
  created_at: Date
  updated_at: Date
  deleted_at: Date
}