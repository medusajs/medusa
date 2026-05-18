import { model } from "@medusajs/framework/utils"

const PlatformType = [
  "taobao",
  "douyin",
  "jd",
  "pdd",
  "wechat",
  "xiaohongshu",
  "other",
] as const

const Shop = model
  .define("Shop", {
    id: model.id({ prefix: "shop" }).primaryKey(),
    shop_code: model.text().unique(),
    shop_name: model.text().searchable(),
    platform_type: model.enum([...PlatformType]),
    platform_shop_id: model.text().nullable(),
    org_id: model.text().nullable(),
    status: model.enum(["active", "inactive"]).default("active"),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_shop_code_unique",
      on: ["shop_code"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_shop_platform_type",
      on: ["platform_type"],
      where: "deleted_at IS NULL",
    },
  ])

export default Shop
