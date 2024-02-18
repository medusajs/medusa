export interface CreateTaxRateDTO {
  rate?: number | null
  code?: string | null
  name: string
  created_by?: string
  metadata?: Record<string, unknown>
}
