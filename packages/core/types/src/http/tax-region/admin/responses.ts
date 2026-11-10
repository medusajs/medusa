import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminTaxRegion } from "./entities"

export interface AdminTaxRegionResponse {
  /**
   * The tax region's details.
   */
  tax_region: AdminTaxRegion
}

export type AdminTaxRegionListResponse = PaginatedResponse<{
  /**
   * The list of tax regions.
   */
  tax_regions: AdminTaxRegion[]
}>

export interface AdminTaxRegionDeleteResponse extends DeleteResponse<"tax_region"> {}
