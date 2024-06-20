import { EntityBuilder } from "@medusajs/utils"

const model = new EntityBuilder()
export const dmlEntity = model.define("dmlEntity", {
  name: model.text(),
})
