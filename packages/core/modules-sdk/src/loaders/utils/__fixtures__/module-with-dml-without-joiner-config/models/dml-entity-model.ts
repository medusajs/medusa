import { model } from "@medusajs/utils"

export const entityModel = model.define("entityModel", {
  name: model.text(),
})
