import { Module, Modules } from "@medusajs/framework/utils"
import { LockingModuleService } from "@services"
import loadProviders from "./loaders/providers"

export default Module(Modules.LOCKING, {
  service: LockingModuleService,
  loaders: [loadProviders],
})

// Module options types
export { LockingModuleOptions } from "./types"
