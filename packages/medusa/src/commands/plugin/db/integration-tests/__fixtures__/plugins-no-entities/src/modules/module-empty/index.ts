import { MedusaService, Module } from "@zjedene-medusa/framework/utils"

export default Module("moduleEmpty", {
  service: class ModuleEmptyService extends MedusaService({}) {},
})

