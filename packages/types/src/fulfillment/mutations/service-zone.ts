import { CreateGeoZoneDTO, UpdateGeoZoneDTO } from "./geo-zone"
import {
  CreateShippingOptionDTO,
  UpdateShippingOptionDTO,
} from "./shipping-option"

export interface CreateServiceZoneDTO {
  name: string
  metadata?: Record<string, unknown> | null
  geo_zones?: (CreateGeoZoneDTO | UpdateGeoZoneDTO)[]
  shipping_options?: (CreateShippingOptionDTO | UpdateShippingOptionDTO)[]
}

export interface UpdateServiceZoneDTO extends Partial<CreateServiceZoneDTO> {
  id: string
}
