import { model } from "@zjedene-medusa/framework/utils"

const model1 = model.define("module_model_1", {
  id: model.id().primaryKey(),
  name: model.text(),
})

export default model1
