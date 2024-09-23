import { defineLink, MedusaService, model, Module } from "@medusajs/utils"

const model3 = model.define("model-3", {
  id: model.id().primaryKey(),
})

const model4 = model.define("model-4", {
  id: model.id().primaryKey(),
})

const module3 = Module("module-3", {
  service: class Service3 extends MedusaService({ model3 }) {},
})

const module4 = Module("module-4", {
  service: class Service4 extends MedusaService({ model4 }) {},
})

export const module3And4Link = defineLink(
  module3.linkable.model3,
  module4.linkable.model4
)
