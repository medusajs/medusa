import { model } from "@zjedene-medusa/utils"

export const Brand = model.define("brand", {
  id: model.id({ prefix: "brand" }).primaryKey(),
  name: model.text(),
  status: model.enum(["active", "inactive"]).default("active"),
})
