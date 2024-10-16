import { Module, Modules } from "@medusajs/framework/utils"
import { default as loadProviders } from "./loaders/providers"
import LockingModuleService from "./services/locking-module"

export default Module(Modules.LOCKING, {
  service: LockingModuleService,
  loaders: [loadProviders],
})

// Module options types
export { LockingModuleOptions } from "./types"
