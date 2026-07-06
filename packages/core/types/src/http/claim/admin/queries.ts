import { BaseFilterable, OperatorMap } from "../../../dal"
import { SelectParams } from "../../common"
import { BaseClaimListParams } from "../common"

export interface AdminClaimListParams
  extends BaseClaimListParams,
    BaseFilterable<AdminClaimListParams> {}

export interface AdminClaimActionsParams extends SelectParams {
  /**
   * Filter by claim ID(s).
   */
  id?: string | string[]
  /**
   * Filter by claim status(es).
   */
  status?: string | string[]
  /**
   * Apply filters on the claim's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the claim's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the claim's deletion date.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminClaimParams extends SelectParams {
  /**
   * Filter by claim ID(s).
   */
  id?: string | string[]
  /**
   * Filter by claim status(es).
   */
  status?: string | string[]
  /**
   * Apply filters on the claim's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the claim's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the claim's deletion date.
   */
  deleted_at?: OperatorMap<string>
}
