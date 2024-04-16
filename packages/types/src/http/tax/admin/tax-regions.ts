import { PaginatedResponse } from "../../../common"
import { TaxRateResponse } from "./tax-rates"

/**
 * @experimental
 */
export interface TaxRegionResponse {
  id: string
  rate: number | null
  code: string | null
  country_code: string | null
  province_code: string | null
  name: string
  metadata: Record<string, unknown> | null
  tax_region_id: string
  is_combinable: boolean
  is_default: boolean
  parent_id: string | null
  created_at: string | Date
  updated_at: string | Date
  deleted_at: Date | null
  created_by: string | null

  tax_rates: TaxRateResponse[]

  parent: TaxRegionResponse
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
