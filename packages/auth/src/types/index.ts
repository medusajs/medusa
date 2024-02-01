import { Logger } from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export * as RepositoryTypes from "./repositories"
export * as ServiceTypes from "./services"
