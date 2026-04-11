export enum Entities {
  invite = "invite",
}

export const defaultAdminInviteFields = [
  "id",
  "email",
  "accepted",
  "token",
  "expires_at",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminInviteFields,
  isList: false,
  entity: Entities.invite,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.invite,
}
