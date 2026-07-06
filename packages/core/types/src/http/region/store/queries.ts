import { FindParams, SelectParams } from "../../common"
import { BaseRegionCountryFilters, BaseRegionFilters } from "../common"

export interface StoreRegionFilters
  extends Omit<BaseRegionFilters, "created_at" | "updated_at">,
    FindParams {}
export interface StoreRegionCountryFilters extends BaseRegionCountryFilters {}

export interface StoreGetRegionParams extends SelectParams {}
