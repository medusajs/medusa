export const defaultAdminWorkflowExecutionDetailFields = [
  "id",
  "workflow_id",
  "transaction_id",
  "context",
  "execution",
  "state",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultAdminWorkflowExecutionsFields = [
  "id",
  "workflow_id",
  "transaction_id",
  "state",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminWorkflowExecutionDetailFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaults: defaultAdminWorkflowExecutionsFields,
  isList: true,
}
