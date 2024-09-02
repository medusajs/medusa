export interface BaseAddress {
  id: string
  customer_id?: string
  first_name?: string
  last_name?: string
  phone?: string
  company?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  metadata: Record<string, unknown> | null
  created_at: Date | string
  updated_at: Date | string
}
