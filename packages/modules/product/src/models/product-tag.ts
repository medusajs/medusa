import { model } from "@medusajs/framework/utils"
import Product from "./product"

const ProductTag = model
  .define(
    { tableName: "product_tag", name: "ProductTag" },
    {
      id: model.id({ prefix: "ptag" }).primaryKey(),
      value: model.text().searchable().translatable(),
      metadata: model.json().nullable(),
      products: model.manyToMany(() => Product, {
        mappedBy: "tags",
      }),
    }
  )
  .indexes([
    {
      name: "IDX_tag_value_unique",
      on: ["value"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default ProductTag
