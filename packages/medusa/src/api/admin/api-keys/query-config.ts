export enum Entities {
  api_key = "api_key",
}

export const defaultAdminApiKeyFields = [
  "id",
  "title",
  "token",
  "redacted",
  "type",
  "last_used_at",
  "updated_at",
  "created_at",
  "created_by",
  "revoked_at",
  "revoked_by",
  "sales_channels.id",
  "sales_channels.name",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminApiKeyFields,
  isList: false,
  entity: Entities.api_key,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
  entity: Entities.api_key,
}
