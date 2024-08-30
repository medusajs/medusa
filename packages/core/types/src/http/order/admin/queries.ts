import { BaseOrderChangesFilters, FindParams } from "../common"
import { BaseFilterable } from "../../../dal";

export interface AdminOrderFilters extends FindParams, BaseFilterable<AdminOrderFilters> {
  id?: string[] | string
  name?: string[] | string
}

export interface AdminOrderChangesFilters extends BaseOrderChangesFilters {}
