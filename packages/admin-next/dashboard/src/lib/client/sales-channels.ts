import {
  CreateSalesChannelReq,
  UpdateSalesChannelReq,
} from "../../types/api-payloads"
import { SalesChannelListRes, SalesChannelRes } from "../../types/api-responses"
import { makeRequest } from "./common"

async function retrieveSalesChannel(id: string, query?: Record<string, any>) {
  return makeRequest<SalesChannelRes, Record<string, any>>(
    `/admin/sales-channels/${id}`,
    query
  )
}

async function listSalesChannels(query?: Record<string, any>) {
  return makeRequest<SalesChannelListRes, Record<string, any>>(
    `/admin/sales-channels`,
    query
  )
}

async function createSalesChannel(payload: CreateSalesChannelReq) {
  return makeRequest<SalesChannelRes>(`/admin/sales-channels`, undefined, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

async function updateSalesChannel(id: string, payload: UpdateSalesChannelReq) {
  return makeRequest<SalesChannelRes>(
    `/admin/sales-channels/${id}`,
    undefined,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )
}

async function deleteSalesChannel(id: string) {
  return makeRequest<void>(`/admin/sales-channels/${id}`, undefined, {
    method: "DELETE",
  })
}

export const salesChannels = {
  retrieve: retrieveSalesChannel,
  list: listSalesChannels,
  create: createSalesChannel,
  update: updateSalesChannel,
  delete: deleteSalesChannel,
}
