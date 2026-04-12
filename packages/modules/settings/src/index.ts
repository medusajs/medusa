import { SettingsModuleService } from "@/services"
import { Module } from "@medusajs/framework/utils"
import { Modules } from "@medusajs/utils"

export default Module(Modules.SETTINGS, {
  service: SettingsModuleService,
})

export * from "./utils"
