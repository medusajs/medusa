export interface CreateCustomerAddressDTO {
  address_name?: string
  is_default_shipping?: boolean
  is_default_billing?: boolean
  customer_id: string
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

export interface UpdateCustomerAddressDTO {
  id?: string
  address_name?: string
  is_default_shipping?: boolean
  is_default_billing?: boolean
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

export interface CreateCustomerDTO {
  company_name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  created_by?: string
  addresses?: Omit<CreateCustomerAddressDTO, "customer_id">[]
  metadata?: Record<string, unknown>
}

export interface UpdateCustomerDTO {
  id: string
  company_name?: string | null
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phone?: string | null
  metadata?: Record<string, unknown> | null
}

export interface CustomerUpdatableFields {
  company_name?: string | null
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phone?: string | null
  metadata?: Record<string, unknown> | null
}

export interface CreateCustomerGroupDTO {
  name: string
  metadata?: Record<string, unknown> | null
  created_by?: string
}

export interface CustomerGroupUpdatableFields {
  name?: string
  metadata?: Record<string, unknown> | null
}

export interface UpdateCustomerGroupDTO {
  id?: string
  name?: string
  customer_ids?: string[]
  metadata?: Record<string, unknown> | null
}

export interface CreateCustomerGroupDTO {
  name: string
  metadata?: Record<string, unknown> | null
  created_by?: string
}

export interface CustomerGroupUpdatableFileds {
  name?: string
  metadata?: Record<string, unknown> | null
}

export interface UpdateCustomerGroupDTO {
  id?: string
  name?: string
  metadata?: Record<string, unknown> | null
}
