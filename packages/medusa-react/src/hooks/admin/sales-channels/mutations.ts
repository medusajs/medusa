import {
  AdminPostSalesChannelReq,
  AdminSalesChannelRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminSalesChannelsKeys } from "./queries"

export const useAdminCreateSalesChannel = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminSalesChannelRes>,
    Error,
    AdminPostSalesChannelReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload) => client.admin.salesChannels.create(payload),
    buildOptions(
      queryClient,
      [adminSalesChannelsKeys.detail(id), adminSalesChannelsKeys.list()],
      options
    )
  )
}
