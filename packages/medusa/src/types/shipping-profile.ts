import { Product, ShippingOption, ShippingProfileType } from "../models"

export type CreateShippingProfile = {
  name: string
}

export type UpdateShippingProfile = {
  name?: string
  metadata?: Record<string, unknown>
  type?: ShippingProfileType
  products?: string[]
  shipping_options?: string[]
}
