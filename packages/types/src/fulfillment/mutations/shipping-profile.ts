import { ShippingProfileType } from "../common"

export interface CreateShippingProfileDTO {
  name: string
  type?: ShippingProfileType
  metadata?: Record<string, unknown>
}

export interface UpdateShippingProfileDTO
  extends Partial<CreateShippingProfileDTO> {}
