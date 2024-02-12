export const defaultAdminWorkflowExecutionsRelations = []
export const allowedAdminWorkflowExecutionsRelations = []
export const defaultAdminWorkflowExecutionsFields = [
  "id",
  "workflow_id",
  "transaction_id",
  "state",
  "created_at",
  "updated_at",
  "deleted_at",
]

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

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminWorkflowExecutionDetailFields,
  defaultRelations: defaultAdminWorkflowExecutionsRelations,
  allowedRelations: allowedAdminWorkflowExecutionsRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultFields: defaultAdminWorkflowExecutionsFields,
  isList: true,
}
