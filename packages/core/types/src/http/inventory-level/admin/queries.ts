import { FindParams } from "../../common"

export interface AdminInventoryLevelFilters extends FindParams {
  location_id?: string | string[]
}
