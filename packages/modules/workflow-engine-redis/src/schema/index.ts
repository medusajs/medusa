export default `
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
  workflow_id: String!
  transaction_id: String!
  run_id: String!
  execution: JSON
  context: JSON
  state: TransactionState
  retention_time: Int
}
`
