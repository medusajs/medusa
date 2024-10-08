import { PaginatedResponse } from "../../common"
import { StoreRegion } from "./entities"

export type StoreRegionResponse = {
  region: StoreRegion
}

export type StoreRegionListResponse = PaginatedResponse<{
  regions: StoreRegion[]
}>
