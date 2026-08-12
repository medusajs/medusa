import { Module } from "@medusajs/framework/utils"
import { PluginModule } from "../../types"
import StarterKitModuleService from "./service"

export default Module(PluginModule.STARTER_KIT, {
  service: StarterKitModuleService,
})
