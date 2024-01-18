import { Logger } from "@medusajs/types"
export * from "./address"
export * from "./customer-group"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}
