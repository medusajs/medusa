export enum Entities {
  file = "file",
}

export const defaultAdminUploadFields = ["id", "url"]

export const retrieveUploadConfig = {
  defaults: defaultAdminUploadFields,
  isList: false,
  entity: Entities.file,
}
