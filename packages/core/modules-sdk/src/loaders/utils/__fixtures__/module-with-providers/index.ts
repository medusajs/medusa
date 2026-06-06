import { ModuleExports } from "@zjedene-medusa/types"
import { ModuleService } from "./services/module-service"
import { Module } from "@zjedene-medusa/utils"

const moduleExports: ModuleExports = {
  service: ModuleService,
}

export * from "./services/module-service"

export default Module("module-with-providers", moduleExports)
