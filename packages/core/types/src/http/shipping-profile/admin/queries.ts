import { OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminShippingProfileListParams extends FindParams {
  /**
   * Filter by shipping profile ID(s).
   */
  id?: string | string[]
  /**
   * Query or keywords to search the shipping profile's searchable fields.
   */
  q?: string
  /**
   * Filter by shipping profile type.
   */
  type?: string
  /**
   * Filter by shipping profile name.
   */
  name?: string
  /**
   * Filter by the date the shipping profile was created.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by the date the shipping profile was updated.
   */
  updated_at?: OperatorMap<string>
  /**
   * Filter by the date the shipping profile was deleted.
   */
  deleted_at?: OperatorMap<string>
  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.
   */
  $and?: AdminShippingProfileListParams[]
  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.
   */
  $or?: AdminShippingProfileListParams[]
}

export interface AdminGetShippingProfileParams extends SelectParams {}
