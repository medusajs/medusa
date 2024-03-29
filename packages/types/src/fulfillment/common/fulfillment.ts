import { ShippingOptionDTO } from "./shipping-option"
import { FulfillmentProviderDTO } from "./fulfillment-provider"
import { FulfillmentAddressDTO } from "./address"
import { FulfillmentItemDTO } from "./fulfillment-item"
import { FulfillmentLabelDTO } from "./fulfillment-label"
import { BaseFilterable, OperatorMap } from "../../dal"

export interface FulfillmentDTO {
  id: string
  location_id: string
  packed_at: Date | null
  shipped_at: Date | null
  delivered_at: Date | null
  canceled_at: Date | null
  data: Record<string, unknown> | null
  provider_id: string
  shipping_option_id: string | null
  metadata: Record<string, unknown> | null
  shipping_option: ShippingOptionDTO | null
  provider: FulfillmentProviderDTO
  delivery_address: FulfillmentAddressDTO
  items: FulfillmentItemDTO[]
  labels: FulfillmentLabelDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface FilterableFulfillmentProps
  extends BaseFilterable<FilterableFulfillmentProps> {
  id?: string | string[] | OperatorMap<string | string[]>
  location_id?: string | string[] | OperatorMap<string | string[]>
  packed_at?: Date | OperatorMap<string | string[]>
  shipped_at?: Date | OperatorMap<string | string[]>
  delivered_at?: Date | OperatorMap<string | string[]>
  canceled_at?: Date | OperatorMap<string | string[]>
  provider_id?: string | string[] | OperatorMap<string | string[]>
  shipping_option_id?: string | null
  created_at?: Date | OperatorMap<string | string[]>
  updated_at?: Date | OperatorMap<string | string[]>
}
