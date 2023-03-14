import { AdminListInvitesRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_INVITES_QUERY_KEY = `admin_invites` as const

export const adminInviteKeys = queryKeysFactory(ADMIN_INVITES_QUERY_KEY)

type InviteQueryKeys = typeof adminInviteKeys

export const useAdminInvites = (
  options?: UseQueryOptionsWrapper<
    Response<AdminListInvitesRes>,
    Error,
    ReturnType<InviteQueryKeys["lists"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminInviteKeys.lists(),
    () => client.admin.invites.list(),
    options
  )
  return { ...data, ...rest } as const
}
