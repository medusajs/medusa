import {
  AdminPostShippingOptionsOptionReq,
  AdminPostShippingOptionsReq,
  AdminShippingOptionsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminShippingOptionKeys } from "./queries"

export const useAdminCreateShippingOption = (
  options?: UseMutationOptions<
    Response<AdminShippingOptionsRes>,
    Error,
    AdminPostShippingOptionsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostShippingOptionsReq) =>
      client.admin.shippingOptions.create(payload),
    buildOptions(queryClient, adminShippingOptionKeys.lists(), options)
  )
}

export const useAdminUpdateShippingOption = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminShippingOptionsRes>,
    Error,
    AdminPostShippingOptionsOptionReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostShippingOptionsOptionReq) =>
      client.admin.shippingOptions.update(id, payload),
    buildOptions(
      queryClient,
      [adminShippingOptionKeys.lists(), adminShippingOptionKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteShippingOption = (
  id: string,
  options?: UseMutationOptions
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.shippingOptions.delete(id),
    buildOptions(
      queryClient,
      [adminShippingOptionKeys.lists(), adminShippingOptionKeys.detail(id)],
      options
    )
  )
}
