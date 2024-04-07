import { PaginatedResponse } from "../../../common"
import { TaxRateResponse } from "./tax-rates"

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

  tax_rates: TaxRateResponse[]
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
