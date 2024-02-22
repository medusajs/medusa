export interface CreateSalesChannelDTO {
  name: string
  description?: string
  is_disabled?: boolean
}

export interface UpdateSalesChannelDTO {
  id: string
  name?: string
  description?: string
  is_disabled?: boolean
}
