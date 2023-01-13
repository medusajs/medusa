import {
  AdminDeleteShippingProfileRes,
  AdminPostShippingProfilesReq,
  AdminShippingProfilesRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminShippingProfileKeys } from "./queries"

export const useAdminCreateShippingProfile = (
  options?: UseMutationOptions<
    Response<AdminShippingProfilesRes>,
    Error,
    AdminPostShippingProfilesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostShippingProfilesReq) =>
      client.admin.shippingProfiles.create(payload),
    buildOptions(queryClient, adminShippingProfileKeys.lists(), options)
  )
}

export const useAdminUpdateShippingProfile = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminShippingProfilesRes>,
    Error,
    AdminPostShippingProfilesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostShippingProfilesReq) =>
      client.admin.shippingProfiles.update(id, payload),
    buildOptions(
      queryClient,
      [adminShippingProfileKeys.lists(), adminShippingProfileKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteShippingProfile = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminDeleteShippingProfileRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.shippingProfiles.delete(id),
    buildOptions(
      queryClient,
      [adminShippingProfileKeys.lists(), adminShippingProfileKeys.detail(id)],
      options
    )
  )
}
