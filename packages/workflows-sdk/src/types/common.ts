import { BaseFilterable } from "@medusajs/types"

export interface WorkflowExecutionDTO {
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

export interface FilterableWorkflowExecutionProps
  extends BaseFilterable<FilterableWorkflowExecutionProps> {
  id?: string[]
  workflow_id?: string[]
  transaction_id?: string[]
  state?: any[]
}
