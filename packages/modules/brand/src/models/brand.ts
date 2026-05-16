import { model } from "@medusajs/framework/utils"

const Brand = model
  .define("Brand", {
    id: model.id({ prefix: "brand" }).primaryKey(),
    name: model.text().searchable(),
    slug: model.text().unique(),
    logo_url: model.text().nullable(),
    description: model.text().nullable(),
    org_id: model.text().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_brand_slug_unique",
      on: ["slug"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default Brand
