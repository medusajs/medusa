import { model } from "@medusajs/framework/utils"
import BasicMaterial from "./basic-material"

const ComboItem = model
  .define("ComboItem", {
    id: model.id({ prefix: "combo" }).primaryKey(),
    quantity: model.number().default(1),
    is_optional: model.boolean().default(false),
    sort_order: model.number().default(0),
    parent_material: model.belongsTo(() => BasicMaterial, {
      mappedBy: "parent_combo_items",
    }),
    child_material: model.belongsTo(() => BasicMaterial, {
      mappedBy: "child_combo_items",
    }),
  })
  .indexes([
    {
      name: "IDX_combo_item_parent",
      on: ["parent_material_id"],
      where: "deleted_at IS NULL",
    },
  ])

export default ComboItem
