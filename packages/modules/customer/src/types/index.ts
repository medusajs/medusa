import { Logger } from "@medusajs/framework/types"

export * as ServiceTypes from "./services"
export * from "./services"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}
