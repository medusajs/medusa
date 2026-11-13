export const defaultAdminAuditLogFields = [
  "id",
  "started_at",
  "ended_at",
  "actor_type",
  "actor_id",
  "impersonator_id",
  "action",
  "resource_type",
  "resource_id",
  "outcome",
  "request",
  "request_data",
  "response_data",
  "metadata",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminAuditLogFields,
  allowed: defaultAdminAuditLogFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
}
