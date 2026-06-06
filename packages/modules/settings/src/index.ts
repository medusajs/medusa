import { SettingsModuleService } from "@/services"
import { Module } from "@zjedene-medusa/framework/utils"
import { Modules } from "@zjedene-medusa/utils"

export default Module(Modules.SETTINGS, {
  service: SettingsModuleService,
})

export * from "./utils"
