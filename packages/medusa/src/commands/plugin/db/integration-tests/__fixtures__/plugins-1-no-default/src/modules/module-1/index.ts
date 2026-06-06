import { MedusaService, Module } from "@zjedene-medusa/framework/utils"

export const module1 = Module("module1", {
  service: class Module1Service extends MedusaService({}) {},
})
