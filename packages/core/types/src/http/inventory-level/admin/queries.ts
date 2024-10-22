import { FindParams } from "../../common"

export interface AdminInventoryLevelFilters extends FindParams {
  /**
   * Filter by stock location IDs to retrieve their
   * associated inventory levels.
   */
  location_id?: string | string[]
}
