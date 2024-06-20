import { EntityBuilder } from "@medusajs/utils"

const model = new EntityBuilder()
export const entityModel = model.define("entityModel", {
  name: model.text(),
})
