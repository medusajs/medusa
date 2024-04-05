import { CreateRegionDTO, UpdateRegionDTO } from "@medusajs/types"
import {
  RegionDeleteRes,
  RegionListRes,
  RegionRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveRegion(id: string, query?: Record<string, any>) {
  return getRequest<RegionRes>(`/admin/regions/${id}`, query)
}

async function listRegions(query?: Record<string, any>) {
  return getRequest<RegionListRes>(`/admin/regions`, query)
}

async function createRegion(payload: CreateRegionDTO) {
  return postRequest<RegionRes>(`/admin/regions`, payload)
}

async function updateRegion(id: string, payload: UpdateRegionDTO) {
  return postRequest<RegionRes>(`/admin/regions/${id}`, payload)
}

async function deleteRegion(id: string) {
  return deleteRequest<RegionDeleteRes>(`/admin/regions/${id}`)
}

export const regions = {
  retrieve: retrieveRegion,
  list: listRegions,
  create: createRegion,
  update: updateRegion,
  delete: deleteRegion,
}
