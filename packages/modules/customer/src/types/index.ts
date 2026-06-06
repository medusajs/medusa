import { Logger } from "@zjedene-medusa/framework/types"

export * as ServiceTypes from "./services"
export * from "./services"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}
