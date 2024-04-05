import { CreateRegionDTO, UpdateRegionDTO } from "@medusajs/types"
import {
  RegionDeleteRes,
  RegionListRes,
  RegionRes,
} from "../../types/api-responses"
import { makeRequest } from "./common"

async function retrieveRegion(id: string, query?: Record<string, any>) {
  return makeRequest<RegionRes, Record<string, any>>(
    `/admin/regions/${id}`,
    query
  )
}

async function listRegions(query?: Record<string, any>) {
  return makeRequest<RegionListRes, Record<string, any>>(
    `/admin/regions`,
    query
  )
}

async function createRegion(region: CreateRegionDTO) {
  return makeRequest<RegionRes>(`/admin/regions`, undefined, {
    method: "POST",
    body: JSON.stringify(region),
  })
}

async function updateRegion(id: string, region: UpdateRegionDTO) {
  return makeRequest<RegionRes>(`/admin/regions/${id}`, undefined, {
    method: "POST",
    body: JSON.stringify(region),
  })
}

async function deleteRegion(id: string) {
  return makeRequest<RegionDeleteRes>(`/admin/regions/${id}`, undefined, {
    method: "DELETE",
  })
}

export const regions = {
  retrieve: retrieveRegion,
  list: listRegions,
  create: createRegion,
  update: updateRegion,
  delete: deleteRegion,
}
