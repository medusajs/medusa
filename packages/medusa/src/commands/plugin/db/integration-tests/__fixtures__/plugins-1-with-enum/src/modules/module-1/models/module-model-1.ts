import { model } from "@medusajs/framework/utils"

// This enum export previously caused plugin:db:generate to crash
export enum MyStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

const model1 = model.define("module_model_1_with_enum", {
  id: model.id().primaryKey(),
  name: model.text(),
})

export default model1
