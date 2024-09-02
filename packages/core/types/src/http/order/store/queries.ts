import { BaseFilterable } from "../../../dal";
import { FindParams } from "../../common";

export interface StoreOrderFilters extends 
  FindParams, BaseFilterable<StoreOrderFilters> {
    id?: string | string[]
    name?: string | string[]
  }
