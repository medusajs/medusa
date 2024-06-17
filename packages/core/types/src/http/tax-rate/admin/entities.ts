import { AdminTaxRegion } from "../../tax-region"

export interface AdminTaxRateRule {
  reference: string
  reference_id: string
}

export interface AdminTaxRate {
  id: string
  rate: number | null
  code: string | null
  name: string
  metadata: Record<string, unknown> | null
  tax_region_id: string
  is_combinable: boolean
  is_default: boolean
  created_at: string
  updated_at: string
  deleted_at: null
  created_by: string | null
  tax_region: AdminTaxRegion
  rules: AdminTaxRateRule[]
}
