export interface UpsertOrderAddressDTO {
  customer_id?: string
  company?: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export interface UpdateOrderAddressDTO extends UpsertOrderAddressDTO {
  id: string
}

export interface CreateOrderAddressDTO extends UpsertOrderAddressDTO {}
