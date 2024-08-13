import { PaginatedResponse } from "../../common";
import { AdminRegion } from "./entities";

export interface AdminRegionResponse {
  region: AdminRegion
}

export type AdminRegionListResponse = PaginatedResponse<{
  regions: AdminRegion[]
}>