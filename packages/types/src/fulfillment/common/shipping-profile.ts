import {
  FilterableShippingOptionProps,
  ShippingOptionDTO,
} from "./shipping-option"
import { BaseFilterable, OperatorMap } from "../../dal"

export type ShippingProfileType = "default" | "gift_card" | "custom"

export interface ShippingProfileDTO {
  id: string
  name: string
  type: ShippingProfileType
  metadata: Record<string, unknown> | null
  shipping_options: ShippingOptionDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface FilterableShippingProfileProps
  extends BaseFilterable<FilterableShippingProfileProps> {
  id?: string | string[] | OperatorMap<string | string[]>
  name?: string | string[] | OperatorMap<string | string[]>
  type?:
    | ShippingProfileType
    | ShippingProfileType[]
    | OperatorMap<ShippingProfileType | ShippingProfileType[]>
  shipping_options?: FilterableShippingOptionProps
}
