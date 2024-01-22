export interface CreateCustomerDTO {
  company_name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  created_by?: string
  metadata?: Record<string, unknown>
}

export interface UpdateCustomerDTO {
  id: string
  company_name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  metadata?: Record<string, unknown>
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
