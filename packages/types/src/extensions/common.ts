export type ExtensionType =
  | "api"
  | "subscribers"
  | "services"
  | "loaders"
  | "migrations"
  | "models"
  | "ui"

export type Extension = {
  name: string
  path: string
  entrypoint: string
  type: ExtensionType
}
