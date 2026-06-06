import { model } from "@zjedene-medusa/utils"

export const entityModel = model.define("entityModel", {
  id: model.id().primaryKey(),
  name: model.text(),
})
