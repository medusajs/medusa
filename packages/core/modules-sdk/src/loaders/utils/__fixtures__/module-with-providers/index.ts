import { ModuleExports } from "@medusajs/types"
import { ModuleService } from "./services/module-service"
import { Module } from "@medusajs/utils"

const moduleExports: ModuleExports = {
  service: ModuleService,
}

export * from "./services/module-service"

export default Module("module-with-providers", moduleExports)
