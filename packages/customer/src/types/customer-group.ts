export type CreateCustomerGroupDTO = {
  name: string
  customer_ids?: string[]
  metadata?: Record<string, unknown> | null
}

export type UpdateCustomerGroupDTO = {
  name?: string
  customer_ids?: string[]
  metadata?: Record<string, unknown> | null
}
