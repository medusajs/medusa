import {
  AdminTaxRegionListResponse,
  AdminTaxRegionResponse,
} from "@medusajs/types"
import { getRequest } from "./common"

async function retrieveTaxRegion(id: string, query?: Record<string, any>) {
  return getRequest<AdminTaxRegionResponse>(`/admin/tax-regions/${id}`, query)
}

async function listTaxRegions(query?: Record<string, any>) {
  return getRequest<AdminTaxRegionListResponse>(`/admin/tax-regions`, query)
}

export const taxes = {
  retrieveTaxRegion,
  listTaxRegions,
}
