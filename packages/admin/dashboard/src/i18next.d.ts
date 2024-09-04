import { Resources } from "./i18n/types"

declare module "i18next" {
  interface CustomTypeOptions {
    resources: Resources
  }
}
