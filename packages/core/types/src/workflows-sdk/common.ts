import { BaseFilterable, OperatorMap } from "../dal"
import { TransactionState } from "../http"
export interface WorkflowExecutionDTO {
  id: string
  workflow_id: string
  transaction_id: string
  execution: Record<string, any> | null
  context: Record<string, any> | null
  state: TransactionState
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface FilterableWorkflowExecutionProps extends BaseFilterable<FilterableWorkflowExecutionProps> {
  q?: string
  id?: string | string[] | OperatorMap<string>
  workflow_id?: string | string[] | OperatorMap<string>
  transaction_id?: string | string[] | OperatorMap<string>
  state?: string | string[] | OperatorMap<string>
  created_at?: string | OperatorMap<string>
  updated_at?: string | OperatorMap<string>
}
