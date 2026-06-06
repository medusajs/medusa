import { MedusaService, Module } from "@zjedene-medusa/framework/utils"

export default Module("module2", {
  service: class Module2Service extends MedusaService({}) {},
})

