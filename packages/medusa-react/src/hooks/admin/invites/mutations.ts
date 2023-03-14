import {
  AdminInviteDeleteRes,
  AdminPostInvitesInviteAcceptReq,
} from "@medusajs/medusa"
import { AdminPostInvitesPayload, Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminInviteKeys } from "./queries"

export const useAdminAcceptInvite = (
  options?: UseMutationOptions<
    Response<void>,
    Error,
    AdminPostInvitesInviteAcceptReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostInvitesInviteAcceptReq) =>
      client.admin.invites.accept(payload),
    buildOptions(queryClient, adminInviteKeys.lists(), options)
  )
}

export const useAdminResendInvite = (
  id: string,
  options?: UseMutationOptions
) => {
  const { client } = useMedusa()
  return useMutation(() => client.admin.invites.resend(id), options)
}

export const useAdminCreateInvite = (
  options?: UseMutationOptions<Response<void>, Error, AdminPostInvitesPayload>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostInvitesPayload) => client.admin.invites.create(payload),
    buildOptions(queryClient, adminInviteKeys.lists(), options)
  )
}

export const useAdminDeleteInvite = (
  id: string,
  options?: UseMutationOptions<Response<AdminInviteDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.invites.delete(id),
    buildOptions(
      queryClient,
      [adminInviteKeys.lists(), adminInviteKeys.detail(id)],
      options
    )
  )
}
