export enum Entities {
  organization = "organization",
}

export const defaultAdminOrganizationFields = [
  "id",
  "name",
  "code",
  "parent_id",
  "org_type",
  "status",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminOrganizationRelations = []

export const allowedAdminOrganizationRelations = []

export const allowedAdminOrganizationFields = defaultAdminOrganizationFields

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminOrganizationFields,
  isList: false,
  entity: Entities.organization,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
  entity: Entities.organization,
}
