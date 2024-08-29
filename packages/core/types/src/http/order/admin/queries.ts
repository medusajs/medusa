import { BaseFilterable } from "../../../dal";

export interface AdminOrderFilters extends BaseFilterable<AdminOrderFilters> {
  id?: string[] | string
  name?: string[] | string
}