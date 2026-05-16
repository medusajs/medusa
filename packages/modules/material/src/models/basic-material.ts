import { model } from "@medusajs/framework/utils"
import SalesMaterial from "./sales-material"
import ComboItem from "./combo-item"
import { MATERIAL_TYPE, SOURCE_TYPE } from "../types"

const BasicMaterial = model
  .define("BasicMaterial", {
    id: model.id({ prefix: "bm" }).primaryKey(),
    material_code: model.text().unique(),
    material_name: model.text().searchable(),
    spu_code: model.text().nullable(),
    material_type: model.enum(MATERIAL_TYPE).default("normal"),
    category_id: model.text().nullable(),
    sn_managed: model.boolean().default(false),
    stock_controlled: model.boolean().default(true),
    tax_rate: model.float().nullable(),
    tax_name: model.text().nullable(),
    tax_code: model.text().nullable(),
    omnichannel: model.boolean().default(false),
    o2o_enabled: model.boolean().default(false),
    color: model.text().nullable(),
    size: model.text().nullable(),
    source: model.enum(SOURCE_TYPE).default("local"),
    org_id: model.text().nullable(),
    metadata: model.json().nullable(),
    sales_materials: model.hasMany(() => SalesMaterial, {
      mappedBy: "basic_material",
    }),
    parent_combo_items: model.hasMany(() => ComboItem, {
      mappedBy: "parent_material",
    }),
    child_combo_items: model.hasMany(() => ComboItem, {
      mappedBy: "child_material",
    }),
  })
  .indexes([
    {
      name: "IDX_basic_material_code_unique",
      on: ["material_code"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_basic_material_spu_code",
      on: ["spu_code"],
      where: "deleted_at IS NULL",
    },
  ])

export default BasicMaterial
