import {
  CreateStockLocationReq,
  UpdateStockLocationReq,
} from "../../types/api-payloads"
import {
  StockLocationDeleteRes,
  StockLocationListRes,
  StockLocationRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function listStockLocations(query?: Record<string, any>) {
  return getRequest<StockLocationListRes>(`/admin/stock-locations`, query)
}

async function retrieveStockLocation(id: string, query?: Record<string, any>) {
  return getRequest<StockLocationRes>(`/admin/stock-locations/${id}`, query)
}

async function createStockLocation(payload: CreateStockLocationReq) {
  return postRequest<StockLocationRes>(`/admin/stock-locations`, payload)
}

async function updateStockLocation(
  id: string,
  payload: UpdateStockLocationReq
) {
  return postRequest<StockLocationRes>(`/admin/stock-locations/${id}`, payload)
}

async function deleteStockLocation(id: string) {
  return deleteRequest<StockLocationDeleteRes>(`/admin/stock-locations/${id}`)
}

export const stockLocations = {
  list: listStockLocations,
  retrieve: retrieveStockLocation,
  create: createStockLocation,
  update: updateStockLocation,
  delete: deleteStockLocation,
}
