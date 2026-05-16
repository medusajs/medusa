import { z } from "zod"

const PlatformType = z.enum([
  "taobao",
  "douyin",
  "jd",
  "pdd",
  "wechat",
  "xiaohongshu",
  "other",
])

export const AdminCreatePlatformSku = z.object({
  shop_id: z.string(),
  platform_type: PlatformType,
  platform_product_id: z.string(),
  platform_sku_id: z.string(),
  platform_sku_code: z.string().optional(),
  sales_material_id: z.string().optional(),
  variant_id: z.string().optional(),
  platform_title: z.string().optional(),
  platform_price: z.number().optional(),
  platform_properties: z.record(z.unknown()).optional(),
  sync_status: z.enum(["pending", "success", "failed"]).optional(),
  mapping_status: z.enum(["unmapped", "mapped"]).optional(),
  listing_status: z.enum(["listed", "delisted"]).optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const AdminUpdatePlatformSku = AdminCreatePlatformSku.partial()

export type AdminCreatePlatformSkuType = z.infer<typeof AdminCreatePlatformSku>
export type AdminUpdatePlatformSkuType = z.infer<typeof AdminUpdatePlatformSku>
