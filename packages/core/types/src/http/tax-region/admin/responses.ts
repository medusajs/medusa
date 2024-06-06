import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminTaxRegion } from "./entities"

export interface AdminTaxRegionResponse {
  tax_region: AdminTaxRegion
}

export type AdminTaxRegionListResponse = PaginatedResponse<{
  tax_regions: AdminTaxRegion[]
}>

export interface AdminTaxRegionDeleteResponse
  extends DeleteResponse<"tax_region"> {}
