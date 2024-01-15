export default `
scalar DateTime
scalar JSON

enum TransactionState {
  NOT_STARTED
  INVOKING
  WAITING_TO_COMPENSATE
  COMPENSATING
  DONE
  REVERTED
  FAILED
}

type WorkflowExecution {
  id: ID!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
  workflow_id: string
  transaction_id: string
  execution: JSON
  context: JSON
  state: TransactionState
}
`
