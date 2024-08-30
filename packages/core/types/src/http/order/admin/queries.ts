import { BaseFilterable, OperatorMap } from "../../../dal";
import { FindParams } from "../../common";

export interface AdminOrderFilters extends FindParams, BaseFilterable<AdminOrderFilters> {
  id?: string[] | string
  status?: string[] | string
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}