import {
  AdminCreateTaxRegion,
  AdminPostTaxRatesTaxRateReq,
} from "@medusajs/medusa"
import {
  AdminTaxRateResponse,
  AdminTaxRegionListResponse,
  AdminTaxRegionResponse,
} from "@medusajs/types"
import { TaxRateDeleteRes, TaxRegionDeleteRes } from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveTaxRegion(id: string, query?: Record<string, any>) {
  return getRequest<AdminTaxRegionResponse>(`/admin/tax-regions/${id}`, query)
}

async function listTaxRegions(query?: Record<string, any>) {
  return getRequest<AdminTaxRegionListResponse>(`/admin/tax-regions`, query)
}

async function createTaxRegion(payload: AdminCreateTaxRegion) {
  return postRequest<AdminTaxRegionResponse>(`/admin/tax-regions`, payload)
}

async function deleteTaxRegion(id: string) {
  return deleteRequest<TaxRegionDeleteRes>(`/admin/tax-regions/${id}`)
}

async function retrieveTaxRate(id: string, query?: Record<string, any>) {
  return getRequest<AdminTaxRegionResponse>(`/admin/tax-rates/${id}`, query)
}

async function listTaxRates(query?: Record<string, any>) {
  return getRequest<AdminTaxRegionListResponse>(`/admin/tax-rates`, query)
}

async function updateTaxRate(id: string, payload: AdminPostTaxRatesTaxRateReq) {
  return postRequest<AdminTaxRateResponse>(`/admin/tax-rates/${id}`, payload)
}

async function createTaxRate(payload: AdminCreateTaxRate) {
  return postRequest<AdminTaxRateResponse>(`/admin/tax-rates`, payload)
}

async function deleteTaxRate(id: string) {
  return deleteRequest<TaxRateDeleteRes>(`/admin/tax-rates/${id}`)
}

export const taxes = {
  retrieveTaxRegion,
  listTaxRegions,
  retrieveTaxRate,
  listTaxRates,
  updateTaxRate,
  createTaxRegion,
  deleteTaxRegion,
  createTaxRate,
  deleteTaxRate,
}
