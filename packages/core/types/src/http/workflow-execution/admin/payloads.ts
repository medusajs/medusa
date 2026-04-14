export interface AdminCreateWorkflowsRun {
  transaction_id?: string | undefined
  input?: any
}

export interface AdminCreateWorkflowsAsyncResponse {
  transaction_id: string
  step_id: string
  response?: any
  compensate_input?: any
  action?: "invoke" | "compensate" | undefined
}
