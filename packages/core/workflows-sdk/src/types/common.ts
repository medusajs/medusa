import { BaseFilterable, OperatorMap } from "@medusajs/types"

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
  id?: string | string[] | OperatorMap<string>
  workflow_id?: string | string[] | OperatorMap<string>
  transaction_id?: string | string[] | OperatorMap<string>
  state?: string | string[] | OperatorMap<string>
}
