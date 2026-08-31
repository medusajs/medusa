import { Module, Modules } from "@medusajs/framework/utils"
import { RbacModuleService } from "@services"
import initialDataLoader from "./loaders/initial-data"
import licenseLoader from "./loaders/license"

export default Module(Modules.RBAC, {
  service: RbacModuleService,
  loaders: [licenseLoader, initialDataLoader],
})
