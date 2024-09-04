import { BaseFilterable } from "../../../dal";
import { OrderStatus } from "../../../order";
import { FindParams } from "../../common";

export interface StoreOrderFilters extends 
  FindParams, BaseFilterable<StoreOrderFilters> {
    id?: string | string[]
    status?: OrderStatus | OrderStatus[]
  }
