import { MODULE_RESOURCE_TYPE } from "@medusajs/modules-sdk"

export * from "./compose-link-name"
export * from "./generate-entity"
export * from "./generate-schema"

export function shouldForceTransaction(target: any): boolean {
  return target.moduleDeclaration?.resources === MODULE_RESOURCE_TYPE.ISOLATED
}

export function doNotForceTransaction(): boolean {
  return false
}
