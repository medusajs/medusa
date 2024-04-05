import {
  AddProductsSalesChannelReq,
  CreateSalesChannelReq,
  RemoveProductsSalesChannelReq,
  UpdateSalesChannelReq,
} from "../../types/api-payloads"
import {
  SalesChannelDeleteRes,
  SalesChannelListRes,
  SalesChannelRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveSalesChannel(id: string, query?: Record<string, any>) {
  return getRequest<SalesChannelRes, Record<string, any>>(
    `/admin/sales-channels/${id}`,
    query
  )
}

async function listSalesChannels(query?: Record<string, any>) {
  return getRequest<SalesChannelListRes, Record<string, any>>(
    `/admin/sales-channels`,
    query
  )
}

async function createSalesChannel(payload: CreateSalesChannelReq) {
  return postRequest<SalesChannelRes>(`/admin/sales-channels`, payload)
}

async function updateSalesChannel(id: string, payload: UpdateSalesChannelReq) {
  return postRequest<SalesChannelRes>(`/admin/sales-channels/${id}`, payload)
}

async function deleteSalesChannel(id: string) {
  return deleteRequest<SalesChannelDeleteRes>(`/admin/sales-channels/${id}`)
}

async function batchRemoveProducts(
  id: string,
  payload: RemoveProductsSalesChannelReq
) {
  return postRequest<SalesChannelRes>(
    `/admin/sales-channels/${id}/products/batch/remove`,
    payload
  )
}

async function batchAddProducts(
  id: string,
  payload: AddProductsSalesChannelReq
) {
  return postRequest<SalesChannelRes>(
    `/admin/sales-channels/${id}/products/batch/add`,
    payload
  )
}

export const salesChannels = {
  retrieve: retrieveSalesChannel,
  list: listSalesChannels,
  create: createSalesChannel,
  update: updateSalesChannel,
  delete: deleteSalesChannel,
  removeProducts: batchRemoveProducts,
  addProducts: batchAddProducts,
}
