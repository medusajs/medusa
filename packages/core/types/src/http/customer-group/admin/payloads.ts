export interface AdminCreateCustomerGroup {
  name: string
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateCustomerGroup {
  name?: string
  metadata?: Record<string, unknown> | null
}
