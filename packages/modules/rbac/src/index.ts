import { Module, Modules } from "@medusajs/framework/utils"
import { RbacModuleService } from "@services"
import corePoliciesLoader from "./loaders/core-policies"
import initialDataLoader from "./loaders/initial-data"

export default Module(Modules.RBAC, {
  service: RbacModuleService,
  loaders: [initialDataLoader, corePoliciesLoader],
})
