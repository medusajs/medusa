import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminGetViewConfigurationParams extends SelectParams {}

export interface AdminGetPropertyLabelParams extends SelectParams {}

export interface AdminGetPropertyLabelsParams
  extends FindParams,
    BaseFilterable<AdminGetPropertyLabelsParams> {
  /**
   * Entity to filter by.
   */
  entity?: string
  /**
   * Property path to filter by.
   */
  property?: string
  /**
   * Search query to filter by.
   */
  q?: string
}

export interface AdminGetViewConfigurationsParams
  extends FindParams,
    BaseFilterable<AdminGetViewConfigurationsParams> {
  /**
   * IDs to filter view configurations by.
   */
  id?: string | string[]
  /**
   * Entity to filter by.
   */
  entity?: string | string[]
  /**
   * Name to filter by.
   */
  name?: string | string[]
  /**
   * User ID to filter by.
   */
  user_id?: string | string[] | null
  /**
   * Filter by system default status.
   */
  is_system_default?: boolean
  /**
   * Date filters for when the view configuration was created.
   */
  created_at?: OperatorMap<string>
  /**
   * Date filters for when the view configuration was updated.
   */
  updated_at?: OperatorMap<string>
}
