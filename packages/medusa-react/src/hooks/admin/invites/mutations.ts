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

/**
 * This hook accepts an Invite. This will also delete the invite and create a new user that can log in and perform admin functionalities.
 * The user will have the email associated with the invite, and the password provided in the mutation function's parameter.
 *
 * @example
 * import React from "react"
 * import { useAdminAcceptInvite } from "medusa-react"
 *
 * const AcceptInvite = () => {
 *   const acceptInvite = useAdminAcceptInvite()
 *   // ...
 *
 *   const handleAccept = (
 *     token: string,
 *     firstName: string,
 *     lastName: string,
 *     password: string
 *   ) => {
 *     acceptInvite.mutate({
 *       token,
 *       user: {
 *         first_name: firstName,
 *         last_name: lastName,
 *         password,
 *       },
 *     }, {
 *       onSuccess: () => {
 *         // invite accepted successfully.
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default AcceptInvite
 *
 * @customNamespace Hooks.Admin.Invites
 * @category Mutations
 */
export const useAdminAcceptInvite = (
  options?: UseMutationOptions<
    Response<void>,
    Error,
    AdminPostInvitesInviteAcceptReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostInvitesInviteAcceptReq) =>
      client.admin.invites.accept(payload),
    ...buildOptions(queryClient, adminInviteKeys.lists(), options),
  })
}

/**
 * This hook resends an invite. This renews the expiry date by seven days and generates a new token for the invite. It also triggers the `invite.created` event,
 * so if you have a Notification Provider installed that handles this event, a notification should be sent to the email associated with the
 * invite to allow them to accept the invite.
 *
 * @example
 * import React from "react"
 * import { useAdminResendInvite } from "medusa-react"
 *
 * type Props = {
 *   inviteId: string
 * }
 *
 * const ResendInvite = ({ inviteId }: Props) => {
 *   const resendInvite = useAdminResendInvite(inviteId)
 *   // ...
 *
 *   const handleResend = () => {
 *     resendInvite.mutate(void 0, {
 *       onSuccess: () => {
 *         // invite resent successfully
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ResendInvite
 *
 * @customNamespace Hooks.Admin.Invites
 * @category Mutations
 */
export const useAdminResendInvite = (
  /**
   * The invite's ID.
   */
  id: string,
  options?: UseMutationOptions
) => {
  const { client } = useMedusa()
  return useMutation({
    mutationFn: () => client.admin.invites.resend(id),
    ...options,
  })
}

export const useAdminCreateInvite = (
  options?: UseMutationOptions<Response<void>, Error, AdminPostInvitesPayload>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostInvitesPayload) =>
      client.admin.invites.create(payload),
    ...buildOptions(queryClient, adminInviteKeys.lists(), options),
  })
}

/**
 * This hook deletes an invite. Only invites that weren't accepted can be deleted.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteInvite } from "medusa-react"
 *
 * type Props = {
 *   inviteId: string
 * }
 *
 * const DeleteInvite = ({ inviteId }: Props) => {
 *   const deleteInvite = useAdminDeleteInvite(inviteId)
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteInvite.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Invite
 *
 * @customNamespace Hooks.Admin.Invites
 * @category Mutations
 */
export const useAdminDeleteInvite = (
  /**
   * The invite's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminInviteDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.invites.delete(id),
    ...buildOptions(
      queryClient,
      [adminInviteKeys.lists(), adminInviteKeys.detail(id)],
      options
    ),
  })
}
