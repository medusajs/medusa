import {
  AdminCampaignListResponse,
  AdminCampaignResponse,
  AdminCreateCampaign,
  AdminUpdateCampaign,
  LinkMethodRequest,
} from "@medusajs/types"
import { CampaignDeleteRes } from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveCampaign(id: string, query?: Record<string, any>) {
  return getRequest<AdminCampaignResponse>(`/admin/campaigns/${id}`, query)
}

async function listCampaigns(query?: Record<string, any>) {
  return getRequest<AdminCampaignListResponse>(`/admin/campaigns`, query)
}

async function createCampaign(payload: AdminCreateCampaign) {
  return postRequest<AdminCampaignResponse>(`/admin/campaigns`, payload)
}

async function updateCampaign(id: string, payload: AdminUpdateCampaign) {
  return postRequest<AdminCampaignResponse>(`/admin/campaigns/${id}`, payload)
}

async function deleteCampaign(id: string) {
  return deleteRequest<CampaignDeleteRes>(`/admin/campaigns/${id}`)
}

async function addOrRemoveCampaignPromotions(
  id: string,
  payload: LinkMethodRequest
) {
  return postRequest<AdminCampaignResponse>(
    `/admin/campaigns/${id}/promotions`,
    payload
  )
}

export const campaigns = {
  retrieve: retrieveCampaign,
  list: listCampaigns,
  create: createCampaign,
  update: updateCampaign,
  delete: deleteCampaign,
  addOrRemovePromotions: addOrRemoveCampaignPromotions,
}
