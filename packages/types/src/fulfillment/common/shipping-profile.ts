import {
  FilterableShippingOptionProps,
  ShippingOptionDTO,
} from "./shipping-option"
import { BaseFilterable, OperatorMap } from "../../dal"

/**
 * The shipping profile details.
 */
export interface ShippingProfileDTO {
  /**
   * The ID of the shipping profile.
   */
  id: string

  /**
   * The name of the shipping profile.
   */
  name: string

  /**
   * The type of the shipping profile.
   */
  type: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The shipping options associated with the shipping profile.
   */
  shipping_options: ShippingOptionDTO[]

  /**
   * The creation date of the shipping profile.
   */
  created_at: Date

  /**
   * The update date of the shipping profile.
   */
  updated_at: Date

  /**
   * The deletion date of the shipping profile.
   */
  deleted_at: Date | null
}

/**
 * The filters to apply on the retrieved shipping profiles.
 */
export interface FilterableShippingProfileProps
  extends BaseFilterable<FilterableShippingProfileProps> {
  /**
   * The IDs to filter the shipping profiles by.
   */
  id?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the shipping profiles by their name.
   */
  name?: string | string[] | OperatorMap<string | string[]>

  /**
   * Filter the shipping profiles by their type.
   */
  type?: string | string[] | OperatorMap<string | string[]>

  /**
   * The filters to apply on the retrieved shipping options.
   */
  shipping_options?: FilterableShippingOptionProps
}
