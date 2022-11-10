import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { Response } from "@medusajs/medusa-js"

import {
  AdminPublishableApiKeyDeleteRes,
  AdminPublishableApiKeysRes,
} from "@medusajs/medusa"

import { buildOptions } from "../../utils/buildOptions"
import { useMedusa } from "../../../contexts"
import { adminPublishableApiKeysKeys } from "."

export const useAdminCreatePublishableApiKey = (
  options?: UseMutationOptions<Response<AdminPublishableApiKeysRes>, Error, {}>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: {}) => client.admin.publishableApiKeys.create(payload),
    buildOptions(queryClient, [adminPublishableApiKeysKeys.lists()], options)
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
