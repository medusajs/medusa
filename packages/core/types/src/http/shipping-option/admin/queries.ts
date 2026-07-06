import { OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminShippingOptionListParams extends FindParams {
  /**
   * Filter by shipping option ID(s),
   */
  id?: string | string[]
  /**
   * Query or keywords to search the shipping option's searchable fields.
   */
  q?: string
  /**
   * Filter by the ID of the service zone(s) to retrieve the shipping options for.
   */
  service_zone_id?: string | string[]
  /**
   * Filter by the ID of the stock location(s) to retrieve the shipping options for.
   */
  stock_location_id?: string | string[]
  /**
   * Filter by whether the shipping option is a return shipping option.
   */
  is_return?: boolean
  /**
   * Filter by whether the shipping option is only available to admins.
   */
  admin_only?: boolean
  /**
   * Filter by the ID of the shipping profile(s) to retrieve the shipping options for.
   */
  shipping_profile_id?: string | string[]
  /**
   * Filter by the ID of the provider(s) to retrieve the shipping options for.
   */
  provider_id?: string | string[]
  /**
   * Filter by the ID of the shipping option type(s) to retrieve the shipping options for.
   */
  shipping_option_type_id?: string | string[]
  /**
   * Filter by the date the shipping option was created.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by the date the shipping option was updated.
   */
  updated_at?: OperatorMap<string>
  /**
   * Filter by the date the shipping option was deleted.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminGetShippingOptionParams extends SelectParams {}

export interface AdminGetShippingOptionRuleParams extends SelectParams {}
