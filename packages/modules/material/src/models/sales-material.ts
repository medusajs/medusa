import { model } from "@medusajs/framework/utils"
import BasicMaterial from "./basic-material"
import { SALES_TYPE, SOURCE_TYPE } from "../types"

const SalesMaterial = model
  .define("SalesMaterial", {
    id: model.id({ prefix: "sm" }).primaryKey(),
    shop_id: model.text(),
    sales_code: model.text(),
    sales_name: model.text().searchable(),
    sales_type: model.enum([...SALES_TYPE]).default("normal"),
    is_bound: model.boolean().default(false),
    customer_class_id: model.text().nullable(),
    org_id: model.text().nullable(),
    tax_rate: model.float().nullable(),
    tax_name: model.text().nullable(),
    tax_code: model.text().nullable(),
    source: model.enum([...SOURCE_TYPE]).default("local"),
    status: model.enum(["active", "inactive"]).default("active"),
    metadata: model.json().nullable(),
    basic_material: model
      .belongsTo(() => BasicMaterial, {
        mappedBy: "sales_materials",
      })
      .nullable(),
  })
  .indexes([
    {
      name: "IDX_sales_material_shop_code",
      on: ["shop_id", "sales_code"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default SalesMaterial
