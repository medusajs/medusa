import { model } from "@medusajs/framework/utils"
import Product from "./product"

const ProductCategory = model
  .define("ProductCategory", {
    id: model.id({ prefix: "pcat" }).primaryKey(),
    name: model.text().searchable().translatable(),
    description: model.text().searchable().translatable().default(""),
    handle: model.text().searchable(),
    mpath: model.text(),
    is_active: model.boolean().default(false),
    is_internal: model.boolean().default(false),
    rank: model.number().default(0),
    metadata: model.json().nullable(),
    parent_category: model
      .belongsTo(() => ProductCategory, {
        mappedBy: "category_children",
      })
      .nullable(),
    category_children: model.hasMany(() => ProductCategory, {
      mappedBy: "parent_category",
    }),
    products: model.manyToMany(() => Product, {
      mappedBy: "categories",
    }),
  })
  .cascades({
    delete: ["category_children"],
  })
  .indexes([
    {
      name: "IDX_product_category_path",
      on: ["mpath"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_category_handle_unique",
      on: ["handle"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default ProductCategory
