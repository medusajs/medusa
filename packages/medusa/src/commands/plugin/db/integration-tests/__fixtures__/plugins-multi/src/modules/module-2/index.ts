import { MedusaService, Module } from "@medusajs/framework/utils"

export default Module("module2", {
  service: class Module2Service extends MedusaService({}) {},
})

