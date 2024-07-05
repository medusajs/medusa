import { CreateCampaignDTO, UpdateCampaignDTO } from "@medusajs/types"
import {
  CampaignDeleteRes,
  CampaignListRes,
  CampaignRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveCampaign(id: string, query?: Record<string, any>) {
  return getRequest<CampaignRes>(`/admin/campaigns/${id}`, query)
}

async function listCampaigns(query?: Record<string, any>) {
  return getRequest<CampaignListRes>(`/admin/campaigns`, query)
}

async function createCampaign(payload: CreateCampaignDTO) {
  return postRequest<CampaignRes>(`/admin/campaigns`, payload)
}

async function updateCampaign(id: string, payload: UpdateCampaignDTO) {
  return postRequest<CampaignRes>(`/admin/campaigns/${id}`, payload)
}

async function deleteCampaign(id: string) {
  return deleteRequest<CampaignDeleteRes>(`/admin/campaigns/${id}`)
}

export const campaigns = {
  retrieve: retrieveCampaign,
  list: listCampaigns,
  create: createCampaign,
  update: updateCampaign,
  delete: deleteCampaign,
}
