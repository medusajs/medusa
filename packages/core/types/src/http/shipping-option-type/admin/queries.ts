import { FindParams, SelectParams } from "../../common"
import { BaseFilterable, OperatorMap } from "../../../dal"

/**
 * The shipping option type details to retrieve.
 */
export interface AdminGetShippingOptionTypeParams extends SelectParams {}

/**
 * The filters to apply on the retrieved shipping option types.
 */
export interface AdminShippingOptionTypeListParams
  extends FindParams,
    BaseFilterable<AdminShippingOptionTypeListParams> {
  /**
   * Search term to filter shipping option types by.
   */
  q?: string | undefined
  /**
   * The IDs to filter the shipping option types by.
   */
  id?: string | string[] | undefined
  /**
   * The labels to filter the shipping option types by.
   */
  label?: string | string[] | undefined
  /**
   * The codes to filter the shipping option types by.
   */
  code?: string | string[] | undefined
  /**
   * The descriptions to filter the shipping option types by.
   */
  description?: string | string[] | undefined
  /**
   * The creation date to filter the shipping option types by.
   */
  created_at?: OperatorMap<string>
  /**
   * The update date to filter the shipping option types by.
   */
  updated_at?: OperatorMap<string>
  /**
   * The deletion date to filter the shipping option types by.
   */
  deleted_at?: OperatorMap<string>
}
