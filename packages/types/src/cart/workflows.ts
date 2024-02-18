export interface CreateCartLineItemDTO {
  variant_id: string
  quantity: number
}

export interface CreateCartAddressDTO {
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
  metadata?: Record<string, unknown>
}

export interface CreateCartWorkflowInputDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code?: string
  shipping_address_id?: string
  billing_address_id?: string
  shipping_address?: CreateCartAddressDTO | string
  billing_address?: CreateCartAddressDTO | string
  metadata?: Record<string, unknown>

  items?: CreateCartLineItemDTO[]
}
