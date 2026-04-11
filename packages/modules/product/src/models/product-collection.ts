import { model } from "@medusajs/framework/utils"
import Product from "./product"

const ProductCollection = model
  .define("ProductCollection", {
    id: model.id({ prefix: "pcol" }).primaryKey(),
    title: model.text().searchable().translatable(),
    handle: model.text(),
    metadata: model.json().nullable(),
    products: model.hasMany(() => Product, {
      mappedBy: "collection",
    }),
  })
  .indexes([
    {
      name: "IDX_collection_handle_unique",
      on: ["handle"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default ProductCollection
