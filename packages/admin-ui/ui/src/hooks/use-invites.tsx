import { Response } from "@medusajs/medusa-js"
import {
useMutation,
UseMutationOptions,
useQueryClient,
} from "@tanstack/react-query"
import { adminInviteKeys, useMedusa } from "medusa-react"
import { buildOptions } from "../utils/build-options"
import { Role } from "../types/shared"

type InviteFormData = {
  user: string
  role: Role
  role_id: string
  region_id: string
}

export const useAdminCreateInviteWithRole = (
options?: UseMutationOptions<Response<void>, Error, InviteFormData>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  const create = (payload: InviteFormData) => {
    const path = `/admin/invite/create`
    return client.admin.invites.client.request("POST", path, payload);
  }

  return useMutation(
    (payload: InviteFormData) => create(payload),
    buildOptions(queryClient, adminInviteKeys.lists(), options)
  )
}
