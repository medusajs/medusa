import { Module, Modules } from "@zjedene-medusa/framework/utils"
import { RbacModuleService } from "@services"
import initialDataLoader from "./loaders/initial-data"

export default Module(Modules.RBAC, {
  service: RbacModuleService,
  loaders: [initialDataLoader],
})
