import { model } from "@medusajs/utils"

export const dmlEntity = model.define("dmlEntity", {
  name: model.text(),
})
