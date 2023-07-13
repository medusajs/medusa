import { MODULE_RESOURCE_TYPE } from "@medusajs/types"

export * from "./create-connection"
export * from "./soft-deletable"

export function shouldForceTransaction(target: any): boolean {
  return target.moduleDeclaration?.resources === MODULE_RESOURCE_TYPE.ISOLATED
}

export function doNotForceTransaction(): boolean {
  return false
}
