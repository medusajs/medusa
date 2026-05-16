export type PlatformType =
  | "taobao"
  | "douyin"
  | "jd"
  | "pdd"
  | "wechat"
  | "xiaohongshu"
  | "other"

export interface CreateShopDTO {
  shop_code: string
  shop_name: string
  platform_type: PlatformType
  platform_shop_id?: string
  org_id?: string
  status?: "active" | "inactive"
  metadata?: Record<string, unknown>
}

export interface UpdateShopDTO {
  shop_code?: string
  shop_name?: string
  platform_type?: PlatformType
  platform_shop_id?: string
  org_id?: string
  status?: "active" | "inactive"
  metadata?: Record<string, unknown>
}
