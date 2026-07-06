import { model } from "@medusajs/framework/utils"

const XModel2 = model.define("x_module_model_2", {
  id: model.id().primaryKey(),
  title: model.text(),
  is_active: model.boolean().default(true),
})

export default XModel2

