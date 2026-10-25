import { Module, Modules } from "@medusajs/framework/utils"
import { NoteModuleService } from "@services"

export default Module(Modules.NOTE, {
  service: NoteModuleService,
})
