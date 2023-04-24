import { Invite } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

const INVITE_QUERY_KEY = `invite,count` as const

export const inviteKeys = queryKeysFactory(INVITE_QUERY_KEY)

type InvitesQueryKeys = typeof inviteKeys

export class AdminGetVendorsParameter {
  offset = 0
  limit = 50
  expand?: string
  fields?: string
}

export interface AdminVendorInviteRes {
  email: string
  role: string
  access_level: string
}

export const useAdminVendorInvites = (
  vendor_id,
  query?: AdminGetVendorsParameter,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ invites: Invite[] }>,
    Error,
    ReturnType<InvitesQueryKeys["list"]>
  >
) => {
  const path = `/admin/invites?initial_vendor_id=${vendor_id}`

  const { data, refetch, ...rest } = useQuery(
    inviteKeys.list({ vendor_id, ...query }),
    () => medusaRequest<Response<{ invites: Invite[] }>>("GET", path),
    options
  )

  return { ...data, ...rest, refetch } as const
}
