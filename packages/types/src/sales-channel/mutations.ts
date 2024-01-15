export type CreateSalesChannelDTO = {
  name: string
  description?: string
  is_disabled?: boolean
}

export type UpdateSalesChannelDTO = {
  id: string
  name?: string
  description?: string
  is_disabled?: boolean
}
