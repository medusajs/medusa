// TODO: The way the cart shipping options are listed now differs from most other endpoints as it is fetched in a workflow.
// We should consider refactoring this to be more consistent with other endpoints.
export interface StoreCartShippingOption {
  id: string
  name: string
  price_type: string
  service_zone_id: string
  shipping_profile_id: string
  provider_id: string
  data: Record<string, unknown> | null
  type: {
    id: string
    label: string
    description: string
    code: string
  }
  provider: {
    id: string
    is_enabled: boolean
  }
  amount: number
}
