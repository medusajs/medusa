import { BaseFilterable } from "../../dal"

export interface WorkflowExecutionDTO {
  id: string
  workflow_id: string
  transaction_id: string
  definition: string
  context: string
  state: any
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

export interface UpsertWorkflowExecutionDTO {
  workflow_id: string
  transaction_id: string
  definition: Record<string, unknown>
  context: Record<string, unknown>
  state: any
}

export interface FilterableWorkflowExecutionProps
  extends BaseFilterable<FilterableWorkflowExecutionProps> {
  id?: string[]
  workflow_id?: string[]
  transaction_id?: string[]
  state?: any[]
}
