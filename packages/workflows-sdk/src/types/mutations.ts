export interface UpsertWorkflowExecutionDTO {
  workflow_id: string
  transaction_id: string
  execution: Record<string, unknown>
  context: Record<string, unknown>
  state: any
}
