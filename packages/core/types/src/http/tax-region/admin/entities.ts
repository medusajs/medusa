import { AdminTaxRate } from "../../tax-rate"

export interface AdminTaxRegion {
  id: string
  country_code: string | null
  province_code: string | null
  metadata: Record<string, unknown> | null
  parent_id: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by: string | null
  tax_rates: AdminTaxRate[]
  parent: AdminTaxRegion | null
  children: AdminTaxRegion[]
}
