import { model } from "@medusajs/utils"

export const entityModel = model.define("entityModel", {
  id: model.id().primaryKey(),
  name: model.text(),
})
