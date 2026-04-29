import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminSalesChannelListParams
  extends FindParams,
    BaseFilterable<AdminSalesChannelListParams> {
  /**
   * Filter by sales channel ID(s).
   */
  id?: string | string[]
  /**
   * Query or keywords to search the sales channel's searchable fields.
   */
  q?: string
  /**
   * Filter by sales channel name.
   */
  name?: string | string[]
  /**
   * Filter by sales channel description.
   */
  description?: string
  /**
   * Filter by whether the sales channel is disabled.
   */
  is_disabled?: boolean
  /**
   * Filter by the ID(s) of the location(s) to retrieve the
   * sales channels for.
   */
  location_id?: string | string[]
  /**
   * Filter by the ID(s) of the publishable key(s) to retrieve the
   * sales channels for.
   */
  publishable_key_id?: string | string[]
  /**
   * Filter by the date when the sales channel was created.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by the date when the sales channel was updated.
   */
  updated_at?: OperatorMap<string>
  /**
   * Filter by the date when the sales channel was deleted.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminGetSalesChannelParams extends SelectParams {}
