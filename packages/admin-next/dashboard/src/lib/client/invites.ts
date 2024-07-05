import { CreateInviteReq } from "../../types/api-payloads"
import {
  InviteDeleteRes,
  InviteListRes,
  InviteRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveInvite(id: string, query?: Record<string, any>) {
  return getRequest<InviteRes, Record<string, any>>(
    `/admin/invites/${id}`,
    query
  )
}

async function listInvites(query?: Record<string, any>) {
  return getRequest<InviteListRes, Record<string, any>>(`/admin/invites`, query)
}

async function createInvite(payload: CreateInviteReq) {
  return postRequest<InviteRes>(`/admin/invites`, payload)
}

async function resendInvite(id: string) {
  return postRequest<InviteRes>(`/admin/invites/${id}/resend`)
}

async function deleteInvite(id: string) {
  return deleteRequest<InviteDeleteRes>(`/admin/invites/${id}`)
}

export const invites = {
  retrieve: retrieveInvite,
  list: listInvites,
  create: createInvite,
  resend: resendInvite,
  delete: deleteInvite,
}
