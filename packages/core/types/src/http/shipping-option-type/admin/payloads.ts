export interface AdminCreateShippingOptionType {
  code: string
  label: string
  description?: string | undefined
}

export interface AdminUpdateShippingOptionType {
  code?: string | undefined
  label?: string | undefined
  description?: string | undefined
}
