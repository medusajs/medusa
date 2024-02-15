import { ShippingProfileType } from "../common"

export interface CreateShippingProfileDTO {
  type?: ShippingProfileType
  metadata?: Record<string, unknown>
}

export interface UpdateShippingProfileDTO
  extends Partial<CreateShippingProfileDTO> {}
