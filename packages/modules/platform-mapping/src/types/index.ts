export const PLATFORM_TYPE = [
  "taobao", "douyin", "jd", "pdd", "wechat", "xiaohongshu", "other",
] as const
export type PlatformType = (typeof PLATFORM_TYPE)[number]

export const SYNC_STATUS = ["pending", "success", "failed"] as const
export type SyncStatus = (typeof SYNC_STATUS)[number]

export const MAPPING_STATUS = ["unmapped", "mapped"] as const
export type MappingStatus = (typeof MAPPING_STATUS)[number]

export const LISTING_STATUS = ["listed", "delisted"] as const
export type ListingStatus = (typeof LISTING_STATUS)[number]

export const SYNC_ACTION = ["create", "update", "delist", "delete"] as const
export type SyncAction = (typeof SYNC_ACTION)[number]

export const TASK_STATUS = ["pending", "processing", "success", "failed"] as const
export type TaskStatus = (typeof TASK_STATUS)[number]

export interface CreatePlatformSkuDTO {
  shop_id: string
  platform_type: PlatformType
  platform_product_id: string
  platform_sku_id: string
  platform_sku_code?: string
  sales_material_id?: string
  variant_id?: string
  platform_title?: string
  platform_price?: number
  platform_properties?: Record<string, unknown>
  sync_status?: SyncStatus
  mapping_status?: MappingStatus
  listing_status?: ListingStatus
  last_sync_at?: Date
  metadata?: Record<string, unknown>
}

export interface UpdatePlatformSkuDTO extends Partial<CreatePlatformSkuDTO> {}

export interface CreatePlatformSyncTaskDTO {
  shop_id: string
  platform_type: PlatformType
  action: SyncAction
  payload: Record<string, unknown>
  status?: TaskStatus
  error_msg?: string
  retry_count?: number
}

export interface UpdatePlatformSyncTaskDTO extends Partial<CreatePlatformSyncTaskDTO> {}
