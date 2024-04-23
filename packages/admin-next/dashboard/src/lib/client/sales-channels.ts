import {
  AdminSalesChannelListResponse,
  AdminSalesChannelResponse,
} from "@medusajs/types"
import {
  AddProductsSalesChannelReq,
  CreateSalesChannelReq,
  RemoveProductsSalesChannelReq,
  UpdateSalesChannelReq,
} from "../../types/api-payloads"
import { SalesChannelDeleteRes } from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveSalesChannel(id: string, query?: Record<string, any>) {
  return getRequest<AdminSalesChannelResponse, Record<string, any>>(
    `/admin/sales-channels/${id}`,
    query
  )
}

async function listSalesChannels(query?: Record<string, any>) {
  return getRequest<AdminSalesChannelListResponse, Record<string, any>>(
    `/admin/sales-channels`,
    query
  )
}

async function createSalesChannel(payload: CreateSalesChannelReq) {
  return postRequest<AdminSalesChannelResponse>(
    `/admin/sales-channels`,
    payload
  )
}

async function updateSalesChannel(id: string, payload: UpdateSalesChannelReq) {
  return postRequest<AdminSalesChannelResponse>(
    `/admin/sales-channels/${id}`,
    payload
  )
}

async function deleteSalesChannel(id: string) {
  return deleteRequest<SalesChannelDeleteRes>(`/admin/sales-channels/${id}`)
}

async function batchRemoveProducts(
  id: string,
  payload: RemoveProductsSalesChannelReq
) {
  return postRequest<AdminSalesChannelResponse>(
    `/admin/sales-channels/${id}/products`,
    {
      remove: payload.product_ids,
    }
  )
}

async function batchAddProducts(
  id: string,
  payload: AddProductsSalesChannelReq
) {
  return postRequest<AdminSalesChannelResponse>(
    `/admin/sales-channels/${id}/products`,
    {
      add: payload.product_ids,
    }
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
