import {
  AdminPostSalesChannelReq,
  AdminSalesChannelRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminSalesChannelsKeys } from "./queries"

/**
 * Hook provides a mutation function for creating sales channel.
 */
export const useAdminCreateSalesChannel = (
  options?: UseMutationOptions<
    Response<AdminSalesChannelRes>,
    Error,
    AdminPostSalesChannelReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostSalesChannelReq) =>
      client.admin.salesChannels.create(payload),
    buildOptions(queryClient, [adminSalesChannelsKeys.list()], options)
  )
}
