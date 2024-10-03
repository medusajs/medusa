import { BaseRegionCountryFilters, BaseRegionFilters } from "../common"

export interface StoreRegionFilters
  extends Omit<BaseRegionFilters, "created_at" | "updated_at"> {}
export interface StoreRegionCountryFilters extends BaseRegionCountryFilters {}
