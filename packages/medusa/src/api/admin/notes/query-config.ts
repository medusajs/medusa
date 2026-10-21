export enum Entities {
  note = "note",
}

export const defaultAdminNoteFields = [
  "id",
  "resource_type",
  "resource_id",
  "value",
  "author_id",
  "created_at",
  "updated_at",
]

export const retrieveNoteTransformQueryConfig = {
  defaults: defaultAdminNoteFields,
  isList: false,
  entity: Entities.note,
}

export const listNotesTransformQueryConfig = {
  ...retrieveNoteTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
  entity: Entities.note,
}
