import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { Response } from "@medusajs/medusa-js"

import {
  AdminPublishableApiKeyDeleteRes,
  AdminPublishableApiKeysRes,
  AdminPostPublishableApiKeysPublishableApiKeyReq,
  AdminPostPublishableApiKeysReq,
  AdminPostPublishableApiKeySalesChannelsBatchReq,
} from "@medusajs/medusa"

import { buildOptions } from "../../utils/buildOptions"
import { useMedusa } from "../../../contexts"
import { adminPublishableApiKeysKeys } from "."

export const useAdminCreatePublishableApiKey = (
  options?: UseMutationOptions<
    Response<AdminPublishableApiKeysRes>,
    Error,
    AdminPostPublishableApiKeysReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostPublishableApiKeysReq) =>
      client.admin.publishableApiKeys.create(payload),
    buildOptions(queryClient, [adminPublishableApiKeysKeys.lists()], options)
  )
}

export const useAdminUpdatePublishableApiKey = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminPublishableApiKeysRes>,
    Error,
    AdminPostPublishableApiKeysPublishableApiKeyReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostPublishableApiKeysPublishableApiKeyReq) =>
      client.admin.publishableApiKeys.update(id, payload),
    buildOptions(
      queryClient,
      [
        adminPublishableApiKeysKeys.lists(),
        adminPublishableApiKeysKeys.detail(id),
        adminPublishableApiKeysKeys.details(),
      ],
      options
    )
  )
}

export const useAdminDeletePublishableApiKey = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminPublishableApiKeyDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.publishableApiKeys.delete(id),
    buildOptions(
      queryClient,
      [
        adminPublishableApiKeysKeys.detail(id),
        adminPublishableApiKeysKeys.lists(),
      ],
      options
    )
  )
}

export const useAdminRevokePublishableApiKey = (
  id: string,
  options?: UseMutationOptions<Response<AdminPublishableApiKeysRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.publishableApiKeys.revoke(id),
    buildOptions(
      queryClient,
      [
        adminPublishableApiKeysKeys.lists(),
        adminPublishableApiKeysKeys.detail(id),
      ],
      options
    )
  )
}

export const useAdminAddPublishableKeySalesChannelsBatch = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminPublishableApiKeysRes>,
    Error,
    AdminPostPublishableApiKeySalesChannelsBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostPublishableApiKeySalesChannelsBatchReq) =>
      client.admin.publishableApiKeys.addSalesChannelsBatch(id, payload),
    buildOptions(
      queryClient,
      [adminPublishableApiKeysKeys.detailSalesChannels(id)],
      options
    )
  )
}

export const useAdminRemovePublishableKeySalesChannelsBatch = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminPublishableApiKeysRes>,
    Error,
    AdminPostPublishableApiKeySalesChannelsBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostPublishableApiKeySalesChannelsBatchReq) =>
      client.admin.publishableApiKeys.deleteSalesChannelsBatch(id, payload),
    buildOptions(
      queryClient,
      [adminPublishableApiKeysKeys.detailSalesChannels(id)],
      options
    )
  )
}
