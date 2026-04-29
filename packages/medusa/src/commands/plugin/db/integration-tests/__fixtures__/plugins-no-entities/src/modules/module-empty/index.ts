import { MedusaService, Module } from "@medusajs/framework/utils"

export default Module("moduleEmpty", {
  service: class ModuleEmptyService extends MedusaService({}) {},
})

