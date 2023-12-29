import { TransactionState } from "@medusajs/utils"

export interface WorkflowExecutionDTO {
  id: string
  workflow_id: string
  transaction_id: string
  definition: string
  context: string
  state: TransactionState
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

export interface UpsertWorkflowExecutionDTO {
  id: string
  workflow_id: string
  transaction_id: string
  definition: string
  context: string
  state: TransactionState
}
