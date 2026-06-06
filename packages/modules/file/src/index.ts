import "./types"
import { FileModuleService } from "@services"
import loadProviders from "./loaders/providers"
import { Module, Modules } from "@zjedene-medusa/framework/utils"

export default Module(Modules.FILE, {
  service: FileModuleService,
  loaders: [loadProviders],
})
