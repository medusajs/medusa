import { Module } from "@medusajs/framework/utils"
import { PluginModule } from "../../types"
import EssentialsModuleService from "./service"

export default Module(PluginModule.ESSENTIALS, {
  service: EssentialsModuleService,
})
