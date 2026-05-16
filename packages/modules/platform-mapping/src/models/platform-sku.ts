import { model } from "@medusajs/framework/utils"
import { PLATFORM_TYPE, SYNC_STATUS, MAPPING_STATUS, LISTING_STATUS } from "../types"

const PlatformSku = model
  .define("PlatformSku", {
    id: model.id({ prefix: "psku" }).primaryKey(),
    shop_id: model.text(),
    platform_type: model.enum(PLATFORM_TYPE),
    platform_product_id: model.text(),
    platform_sku_id: model.text(),
    platform_sku_code: model.text().nullable(),
    sales_material_id: model.text().nullable(),
    variant_id: model.text().nullable(),
    platform_title: model.text().nullable(),
    platform_price: model.float().nullable(),
    platform_properties: model.json().nullable(),
    sync_status: model.enum(SYNC_STATUS).default("pending"),
    mapping_status: model.enum(MAPPING_STATUS).default("unmapped"),
    listing_status: model.enum(LISTING_STATUS).default("listed"),
    last_sync_at: model.dateTime().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_platform_sku_shop_platform",
      on: ["shop_id", "platform_type", "platform_sku_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default PlatformSku
