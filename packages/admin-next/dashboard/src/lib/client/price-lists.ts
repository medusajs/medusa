import {
  AddPriceListPricesReq,
  CreatePriceListReq,
  DeletePriceListPricesReq,
  UpdatePriceListReq,
} from "../../types/api-payloads"
import {
  PriceListDeleteRes,
  PriceListListRes,
  PriceListRes,
} from "../../types/api-responses"
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

async function deletePriceList(id: string) {
  return postRequest<PriceListDeleteRes>(`/admin/price-lists/${id}/delete`)
}

async function addPriceListPrices(id: string, payload: AddPriceListPricesReq) {
  return postRequest<PriceListRes>(`/admin/price-lists/${id}/prices/batch`, {
    create: payload.prices,
  })
}

async function removePriceListPrices(
  id: string,
  payload: DeletePriceListPricesReq
) {
  return postRequest<PriceListRes>(`/admin/price-lists/${id}/prices/batch`, {
    delete: payload.ids,
  })
}

export const priceLists = {
  retrieve: retrievePriceLists,
  list: listPriceLists,
  create: createPriceList,
  update: updatePriceList,
  delete: deletePriceList,
  addPrices: addPriceListPrices,
  removePrices: removePriceListPrices,
}
