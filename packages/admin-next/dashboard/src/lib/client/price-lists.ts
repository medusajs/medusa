import {
  CreatePriceListReq,
  UpdatePriceListReq,
} from "../../types/api-payloads"
import { PriceListListRes, PriceListRes } from "../../types/api-responses"
import { getRequest, postRequest } from "./common"

async function retrievePriceLists(id: string, query?: Record<string, any>) {
  return getRequest<PriceListRes>(`/admin/price-lists/${id}`, query)
}

async function listPriceLists(query?: Record<string, any>) {
  return getRequest<PriceListListRes>(`/admin/price-lists`, query)
}

async function createPriceList(payload: CreatePriceListReq) {
  return postRequest<PriceListRes>(`/admin/price-lists`, payload)
}

async function updatePriceList(id: string, payload: UpdatePriceListReq) {
  return postRequest<PriceListRes>(`/admin/price-lists/${id}`, payload)
}

export const priceLists = {
  retrieve: retrievePriceLists,
  list: listPriceLists,
  create: createPriceList,
  update: updatePriceList,
}
