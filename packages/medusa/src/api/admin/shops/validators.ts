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

export const AdminCreateShop = z.object({
  shop_code: z.string(),
  shop_name: z.string(),
  platform_type: PlatformType,
  platform_shop_id: z.string().optional(),
  org_id: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminCreateShopType = z.infer<typeof AdminCreateShop>

export const AdminUpdateShop = z.object({
  shop_code: z.string().optional(),
  shop_name: z.string().optional(),
  platform_type: PlatformType.optional(),
  platform_shop_id: z.string().optional(),
  org_id: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminUpdateShopType = z.infer<typeof AdminUpdateShop>
