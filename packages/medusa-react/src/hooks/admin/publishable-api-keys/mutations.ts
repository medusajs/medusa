import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import {
  AdminDeletePublishableApiKeySalesChannelsBatchReq,
  AdminPostPublishableApiKeySalesChannelsBatchReq,
  AdminPostPublishableApiKeysPublishableApiKeyReq,
  AdminPostPublishableApiKeysReq,
  AdminPublishableApiKeyDeleteRes,
  AdminPublishableApiKeysRes,
} from "@medusajs/medusa"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminPublishableApiKeysKeys } from "./queries"

/**
 * This hook creates a publishable API key.
 *
 * @example
 * import React from "react"
 * import { useAdminCreatePublishableApiKey } from "medusa-react"
 *
 * const CreatePublishableApiKey = () => {
 *   const createKey = useAdminCreatePublishableApiKey()
 *   // ...
 *
 *   const handleCreate = (title: string) => {
 *     createKey.mutate({
 *       title,
 *     }, {
 *       onSuccess: ({ publishable_api_key }) => {
 *         console.log(publishable_api_key.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreatePublishableApiKey
 *
 * @customNamespace Hooks.Admin.Publishable API Keys
 * @category Mutations
 */
export const useAdminCreatePublishableApiKey = (
  options?: UseMutationOptions<
    Response<AdminPublishableApiKeysRes>,
    Error,
    AdminPostPublishableApiKeysReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostPublishableApiKeysReq) =>
      client.admin.publishableApiKeys.create(payload),
    ...buildOptions(
      queryClient,
      [adminPublishableApiKeysKeys.lists()],
      options
    ),
  })
}

/**
 * This hook updates a publishable API key's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdatePublishableApiKey } from "medusa-react"
 *
 * type Props = {
 *   publishableApiKeyId: string
 * }
 *
 * const PublishableApiKey = ({
 *   publishableApiKeyId
 * }: Props) => {
 *   const updateKey = useAdminUpdatePublishableApiKey(
 *     publishableApiKeyId
 *   )
 *   // ...
 *
 *   const handleUpdate = (title: string) => {
 *     updateKey.mutate({
 *       title,
 *     }, {
 *       onSuccess: ({ publishable_api_key }) => {
 *         console.log(publishable_api_key.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PublishableApiKey
 *
 * @customNamespace Hooks.Admin.Publishable API Keys
 * @category Mutations
 */
export const useAdminUpdatePublishableApiKey = (
  /**
   * The publishable API key's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPublishableApiKeysRes>,
    Error,
    AdminPostPublishableApiKeysPublishableApiKeyReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostPublishableApiKeysPublishableApiKeyReq) =>
      client.admin.publishableApiKeys.update(id, payload),
    ...buildOptions(
      queryClient,
      [
        adminPublishableApiKeysKeys.lists(),
        adminPublishableApiKeysKeys.detail(id),
        adminPublishableApiKeysKeys.details(),
      ],
      options
    ),
  })
}

/**
 * This hook deletes a publishable API key. Associated resources, such as sales channels, are not deleted.
 *
 * @example
 * import React from "react"
 * import { useAdminDeletePublishableApiKey } from "medusa-react"
 *
 * type Props = {
 *   publishableApiKeyId: string
 * }
 *
 * const PublishableApiKey = ({
 *   publishableApiKeyId
 * }: Props) => {
 *   const deleteKey = useAdminDeletePublishableApiKey(
 *     publishableApiKeyId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteKey.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PublishableApiKey
 *
 * @customNamespace Hooks.Admin.Publishable API Keys
 * @category Mutations
 */
export const useAdminDeletePublishableApiKey = (
  /**
   * The publishable API key's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPublishableApiKeyDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.publishableApiKeys.delete(id),
    ...buildOptions(
      queryClient,
      [
        adminPublishableApiKeysKeys.detail(id),
        adminPublishableApiKeysKeys.lists(),
      ],
      options
    ),
  })
}

/**
 * This hook revokes a publishable API key. Revoking the publishable API Key can't be undone, and the key can't be used in future requests.
 *
 * @example
 * import React from "react"
 * import { useAdminRevokePublishableApiKey } from "medusa-react"
 *
 * type Props = {
 *   publishableApiKeyId: string
 * }
 *
 * const PublishableApiKey = ({
 *   publishableApiKeyId
 * }: Props) => {
 *   const revokeKey = useAdminRevokePublishableApiKey(
 *     publishableApiKeyId
 *   )
 *   // ...
 *
 *   const handleRevoke = () => {
 *     revokeKey.mutate(void 0, {
 *       onSuccess: ({ publishable_api_key }) => {
 *         console.log(publishable_api_key.revoked_at)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PublishableApiKey
 *
 * @customNamespace Hooks.Admin.Publishable API Keys
 * @category Mutations
 */
export const useAdminRevokePublishableApiKey = (
  /**
   * The publishable API key's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminPublishableApiKeysRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.publishableApiKeys.revoke(id),
    ...buildOptions(
      queryClient,
      [
        adminPublishableApiKeysKeys.lists(),
        adminPublishableApiKeysKeys.detail(id),
      ],
      options
    ),
  })
}

/**
 * This hook adds a list of sales channels to a publishable API key.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminAddPublishableKeySalesChannelsBatch,
 * } from "medusa-react"
 *
 * type Props = {
 *   publishableApiKeyId: string
 * }
 *
 * const PublishableApiKey = ({
 *   publishableApiKeyId
 * }: Props) => {
 *   const addSalesChannels =
 *     useAdminAddPublishableKeySalesChannelsBatch(
 *       publishableApiKeyId
 *     )
 *   // ...
 *
 *   const handleAdd = (salesChannelId: string) => {
 *     addSalesChannels.mutate({
 *       sales_channel_ids: [
 *         {
 *           id: salesChannelId,
 *         },
 *       ],
 *     }, {
 *       onSuccess: ({ publishable_api_key }) => {
 *         console.log(publishable_api_key.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PublishableApiKey
 *
 * @customNamespace Hooks.Admin.Publishable API Keys
 * @category Mutations
 */
export const useAdminAddPublishableKeySalesChannelsBatch = (
  /**
   * The publishable API key's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPublishableApiKeysRes>,
    Error,
    AdminPostPublishableApiKeySalesChannelsBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostPublishableApiKeySalesChannelsBatchReq) =>
      client.admin.publishableApiKeys.addSalesChannelsBatch(id, payload),
    ...buildOptions(
      queryClient,
      [adminPublishableApiKeysKeys.detailSalesChannels(id)],
      options
    ),
  })
}

/**
 * This hook removes a list of sales channels from a publishable API key. This doesn't delete the sales channels and only
 * removes the association between them and the publishable API key.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminRemovePublishableKeySalesChannelsBatch,
 * } from "medusa-react"
 *
 * type Props = {
 *   publishableApiKeyId: string
 * }
 *
 * const PublishableApiKey = ({
 *   publishableApiKeyId
 * }: Props) => {
 *   const deleteSalesChannels =
 *     useAdminRemovePublishableKeySalesChannelsBatch(
 *       publishableApiKeyId
 *     )
 *   // ...
 *
 *   const handleDelete = (salesChannelId: string) => {
 *     deleteSalesChannels.mutate({
 *       sales_channel_ids: [
 *         {
 *           id: salesChannelId,
 *         },
 *       ],
 *     }, {
 *       onSuccess: ({ publishable_api_key }) => {
 *         console.log(publishable_api_key.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default PublishableApiKey
 *
 * @customNamespace Hooks.Admin.Publishable API Keys
 * @category Mutations
 */
export const useAdminRemovePublishableKeySalesChannelsBatch = (
  /**
   * The publishable API key's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPublishableApiKeysRes>,
    Error,
    AdminDeletePublishableApiKeySalesChannelsBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminDeletePublishableApiKeySalesChannelsBatchReq) =>
      client.admin.publishableApiKeys.deleteSalesChannelsBatch(id, payload),
    ...buildOptions(
      queryClient,
      [adminPublishableApiKeysKeys.detailSalesChannels(id)],
      options
    ),
  })
}
