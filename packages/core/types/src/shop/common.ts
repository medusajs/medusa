import { BaseFilterable } from "../dal"

export type PlatformType =
  | "taobao"
  | "douyin"
  | "jd"
  | "pdd"
  | "wechat"
  | "xiaohongshu"
  | "other"

/**
 * The shop details.
 */
export interface ShopDTO {
  /**
   * The ID of the shop.
   */
  id: string

  /**
   * The shop code.
   */
  shop_code: string

  /**
   * The shop name.
   */
  shop_name: string

  /**
   * The platform type.
   */
  platform_type: PlatformType

  /**
   * The platform shop ID.
   */
  platform_shop_id?: string

  /**
   * The org ID.
   */
  org_id?: string

  /**
   * The status of the shop.
   */
  status: "active" | "inactive"

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * The created at of the shop.
   */
  created_at: string

  /**
   * The updated at of the shop.
   */
  updated_at: string
}

/**
 * The filters to apply on the retrieved shops.
 */
export interface FilterableShopProps
  extends BaseFilterable<FilterableShopProps> {
  /**
   * Find shops by name or code through this search term.
   */
  q?: string

  /**
   * The IDs to filter the shops by.
   */
  id?: string | string[]

  /**
   * Filter shops by their shop codes.
   */
  shop_code?: string | string[]

  /**
   * Filter shops by their platform types.
   */
  platform_type?: PlatformType | PlatformType[]
}
