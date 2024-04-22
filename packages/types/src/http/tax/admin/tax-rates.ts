import { PaginatedResponse } from "../../../common"
import { TaxRegionResponse } from "./tax-regions"

/**
 * @experimental
 */
export interface TaxRateResponse {
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
  tax_region: TaxRegionResponse
  rules: {
    reference: string
    reference_id: string
  }[]
}

/**
 * @experimental
 */
export interface AdminTaxRateResponse {
  tax_rate: TaxRateResponse
}

/**
 * @experimental
 */
export interface AdminTaxRateListResponse extends PaginatedResponse {
  tax_rates: TaxRateResponse[]
}
