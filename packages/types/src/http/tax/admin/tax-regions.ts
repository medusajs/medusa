import { PaginatedResponse } from "../../../common"

/**
 * @experimental
 */
interface TaxRegionResponse {
  id: string
  rate: number | null
  code: string | null
  name: string
  metadata: Record<string, unknown> | null
  tax_region_id: string
  is_combinable: boolean
  is_default: boolean
  created_at: string | Date
  updated_at: string | Date
  deleted_at: Date | null
  created_by: string | null
}

/**
 * @experimental
 */
export interface AdminTaxRegionResponse {
  tax_region: TaxRegionResponse
}

/**
 * @experimental
 */
export interface AdminTaxRegionListResponse extends PaginatedResponse {
  tax_regions: TaxRegionResponse[]
}
