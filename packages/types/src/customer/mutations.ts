export interface CreateCustomerDTO {
  company_name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  metadata?: Record<string, unknown>
}
