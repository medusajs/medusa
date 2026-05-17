import { BaseFilterable } from "../dal"
import { PlatformType } from "../shop"

export type SyncStatus = "pending" | "success" | "failed"

export type MappingStatus = "unmapped" | "mapped"

export type ListingStatus = "listed" | "delisted"

export type SyncAction = "create" | "update" | "delist" | "delete"

export type TaskStatus = "pending" | "processing" | "success" | "failed"

/**
 * The platform SKU details.
 */
export interface PlatformSkuDTO {
  id: string
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
  sync_status: SyncStatus
  mapping_status: MappingStatus
  listing_status: ListingStatus
  last_sync_at?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

/**
 * The platform sync task details.
 */
export interface PlatformSyncTaskDTO {
  id: string
  shop_id: string
  platform_type: PlatformType
  action: SyncAction
  payload: Record<string, unknown>
  status: TaskStatus
  error_msg?: string
  retry_count: number
  created_at: string
  updated_at: string
}

/**
 * The filters to apply on the retrieved platform SKUs.
 */
export interface FilterablePlatformSkuProps
  extends BaseFilterable<FilterablePlatformSkuProps> {
  q?: string
  id?: string | string[]
  shop_id?: string | string[]
  platform_type?: PlatformType | PlatformType[]
  sync_status?: SyncStatus | SyncStatus[]
  mapping_status?: MappingStatus | MappingStatus[]
  listing_status?: ListingStatus | ListingStatus[]
}

/**
 * The filters to apply on the retrieved platform sync tasks.
 */
export interface FilterablePlatformSyncTaskProps
  extends BaseFilterable<FilterablePlatformSyncTaskProps> {
  q?: string
  id?: string | string[]
  shop_id?: string | string[]
  platform_type?: PlatformType | PlatformType[]
  action?: SyncAction | SyncAction[]
  status?: TaskStatus | TaskStatus[]
}
