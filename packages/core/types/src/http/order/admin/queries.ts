import { BaseOrderChangesFilters } from "../common"
import { BaseFilterable } from "../../../dal"
import { FindParams } from "../../common"

export interface AdminOrderFilters
  extends FindParams,
    BaseFilterable<AdminOrderFilters> {
  id?: string[] | string
  name?: string[] | string
}

export interface AdminOrderChangesFilters extends BaseOrderChangesFilters {}
