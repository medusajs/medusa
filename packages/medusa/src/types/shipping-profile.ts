import { ShippingProfileType } from "../models"

export type CreateShippingProfile = {
  name: string
  type: ShippingProfileType
  metadata?: Record<string, unknown>
}

export type UpdateShippingProfile = {
  name?: string
  metadata?: Record<string, unknown>
  type?: ShippingProfileType
  products?: string[]
  shipping_options?: string[]
}
