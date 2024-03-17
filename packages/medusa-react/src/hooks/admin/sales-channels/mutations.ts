import {
  AdminDeleteSalesChannelsChannelProductsBatchReq,
  AdminPostSalesChannelsChannelProductsBatchReq,
  AdminPostSalesChannelsReq,
  AdminPostSalesChannelsSalesChannelReq,
  AdminSalesChannelsDeleteRes,
  AdminSalesChannelsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminProductKeys } from "../products"
import { adminStockLocationsKeys } from "../stock-locations"
import { adminSalesChannelsKeys } from "./queries"

/**
 * This hook creates a sales channel.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateSalesChannel } from "medusa-react"
 *
 * const CreateSalesChannel = () => {
 *   const createSalesChannel = useAdminCreateSalesChannel()
 *   // ...
 *
 *   const handleCreate = (name: string, description: string) => {
 *     createSalesChannel.mutate({
 *       name,
 *       description,
 *     }, {
 *       onSuccess: ({ sales_channel }) => {
 *         console.log(sales_channel.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateSalesChannel
 *
 * @customNamespace Hooks.Admin.Sales Channels
 * @category Mutations
 */
export const useAdminCreateSalesChannel = (
  options?: UseMutationOptions<
    Response<AdminSalesChannelsRes>,
    Error,
    AdminPostSalesChannelsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostSalesChannelsReq) =>
      client.admin.salesChannels.create(payload),
    ...buildOptions(queryClient, [adminSalesChannelsKeys.list()], options),
  })
}

/**
 * This hook updates a sales channel's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateSalesChannel } from "medusa-react"
 *
 * type Props = {
 *   salesChannelId: string
 * }
 *
 * const SalesChannel = ({ salesChannelId }: Props) => {
 *   const updateSalesChannel = useAdminUpdateSalesChannel(
 *     salesChannelId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     is_disabled: boolean
 *   ) => {
 *     updateSalesChannel.mutate({
 *       is_disabled,
 *     }, {
 *       onSuccess: ({ sales_channel }) => {
 *         console.log(sales_channel.is_disabled)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default SalesChannel
 *
 * @customNamespace Hooks.Admin.Sales Channels
 * @category Mutations
 */
export const useAdminUpdateSalesChannel = (
  /**
   * The sales channel's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminSalesChannelsRes>,
    Error,
    AdminPostSalesChannelsSalesChannelReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostSalesChannelsSalesChannelReq) =>
      client.admin.salesChannels.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminSalesChannelsKeys.lists(), adminSalesChannelsKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a sales channel. Associated products, stock locations, and other resources are not deleted.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteSalesChannel } from "medusa-react"
 *
 * type Props = {
 *   salesChannelId: string
 * }
 *
 * const SalesChannel = ({ salesChannelId }: Props) => {
 *   const deleteSalesChannel = useAdminDeleteSalesChannel(
 *     salesChannelId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteSalesChannel.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default SalesChannel
 *
 * @customNamespace Hooks.Admin.Sales Channels
 * @category Mutations
 */
export const useAdminDeleteSalesChannel = (
  /**
   * The sales channel's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminSalesChannelsDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => client.admin.salesChannels.delete(id),
    ...buildOptions(
      queryClient,
      [adminSalesChannelsKeys.lists(), adminSalesChannelsKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook removes a list of products from a sales channel. This doesn't delete the product. It only removes the
 * association between the product and the sales channel.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminDeleteProductsFromSalesChannel,
 * } from "medusa-react"
 *
 * type Props = {
 *   salesChannelId: string
 * }
 *
 * const SalesChannel = ({ salesChannelId }: Props) => {
 *   const deleteProducts = useAdminDeleteProductsFromSalesChannel(
 *     salesChannelId
 *   )
 *   // ...
 *
 *   const handleDeleteProducts = (productId: string) => {
 *     deleteProducts.mutate({
 *       product_ids: [
 *         {
 *           id: productId,
 *         },
 *       ],
 *     }, {
 *       onSuccess: ({ sales_channel }) => {
 *         console.log(sales_channel.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default SalesChannel
 *
 * @customNamespace Hooks.Admin.Sales Channels
 * @category Mutations
 */
export const useAdminDeleteProductsFromSalesChannel = (
  /**
   * The sales channel's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminSalesChannelsRes>,
    Error,
    AdminDeleteSalesChannelsChannelProductsBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminDeleteSalesChannelsChannelProductsBatchReq) => {
      return client.admin.salesChannels.removeProducts(id, payload)
    },
    ...buildOptions(
      queryClient,
      [
        adminSalesChannelsKeys.lists(),
        adminSalesChannelsKeys.detail(id),
        adminProductKeys.list({ sales_channel_id: [id] }),
      ],
      options
    ),
  })
}

/**
 * This hook adds a list of products to a sales channel.
 *
 * @example
 * import React from "react"
 * import { useAdminAddProductsToSalesChannel } from "medusa-react"
 *
 * type Props = {
 *   salesChannelId: string
 * }
 *
 * const SalesChannel = ({ salesChannelId }: Props) => {
 *   const addProducts = useAdminAddProductsToSalesChannel(
 *     salesChannelId
 *   )
 *   // ...
 *
 *   const handleAddProducts = (productId: string) => {
 *     addProducts.mutate({
 *       product_ids: [
 *         {
 *           id: productId,
 *         },
 *       ],
 *     }, {
 *       onSuccess: ({ sales_channel }) => {
 *         console.log(sales_channel.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default SalesChannel
 *
 * @customNamespace Hooks.Admin.Sales Channels
 * @category Mutations
 */
export const useAdminAddProductsToSalesChannel = (
  /**
   * The sales channel's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminSalesChannelsRes>,
    Error,
    AdminPostSalesChannelsChannelProductsBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostSalesChannelsChannelProductsBatchReq) => {
      return client.admin.salesChannels.addProducts(id, payload)
    },
    ...buildOptions(
      queryClient,
      [
        adminSalesChannelsKeys.lists(),
        adminSalesChannelsKeys.detail(id),
        adminProductKeys.list({ sales_channel_id: [id] }),
      ],
      options
    ),
  })
}

/**
 * This hook associates a stock location with a sales channel. It requires the
 * [@medusajs/stock-location](https://docs.medusajs.com/modules/multiwarehouse/install-modules#stock-location-module) module to be installed in
 * your Medusa backend.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminAddLocationToSalesChannel
 * } from "medusa-react"
 *
 * type Props = {
 *   salesChannelId: string
 * }
 *
 * const SalesChannel = ({ salesChannelId }: Props) => {
 *   const addLocation = useAdminAddLocationToSalesChannel()
 *   // ...
 *
 *   const handleAddLocation = (locationId: string) => {
 *     addLocation.mutate({
 *       sales_channel_id: salesChannelId,
 *       location_id: locationId
 *     }, {
 *       onSuccess: ({ sales_channel }) => {
 *         console.log(sales_channel.locations)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default SalesChannel
 *
 * @customNamespace Hooks.Admin.Sales Channels
 * @category Mutations
 */
export const useAdminAddLocationToSalesChannel = (
  options?: UseMutationOptions<
    Response<AdminSalesChannelsRes>,
    Error,
    {
      /**
       * The sales channel's ID.
       */
      sales_channel_id: string
      /**
       * The location's ID.
       */
      location_id: string
    }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sales_channel_id, location_id }) => {
      return client.admin.salesChannels.addLocation(sales_channel_id, {
        location_id,
      })
    },
    ...buildOptions(
      queryClient,
      [
        adminSalesChannelsKeys.lists(),
        adminSalesChannelsKeys.details(),
        adminStockLocationsKeys.all,
      ],
      options
    ),
  })
}

/**
 * This hook removes a stock location from a sales channel. This only removes the association between the stock
 * location and the sales channel. It does not delete the stock location. This hook requires the
 * [@medusajs/stock-location](https://docs.medusajs.com/modules/multiwarehouse/install-modules#stock-location-module) module to be installed in
 * your Medusa backend.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminRemoveLocationFromSalesChannel
 * } from "medusa-react"
 *
 * type Props = {
 *   salesChannelId: string
 * }
 *
 * const SalesChannel = ({ salesChannelId }: Props) => {
 *   const removeLocation = useAdminRemoveLocationFromSalesChannel()
 *   // ...
 *
 *   const handleRemoveLocation = (locationId: string) => {
 *     removeLocation.mutate({
 *       sales_channel_id: salesChannelId,
 *       location_id: locationId
 *     }, {
 *       onSuccess: ({ sales_channel }) => {
 *         console.log(sales_channel.locations)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default SalesChannel
 *
 * @customNamespace Hooks.Admin.Sales Channels
 * @category Mutations
 */
export const useAdminRemoveLocationFromSalesChannel = (
  options?: UseMutationOptions<
    Response<AdminSalesChannelsRes>,
    Error,
    {
      /**
       * The sales channel's ID.
       */
      sales_channel_id: string
      /**
       * The location's ID.
       */
      location_id: string
    }
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sales_channel_id, location_id }) => {
      return client.admin.salesChannels.removeLocation(sales_channel_id, {
        location_id,
      })
    },
    ...buildOptions(
      queryClient,
      [
        adminSalesChannelsKeys.lists(),
        adminSalesChannelsKeys.details(),
        adminStockLocationsKeys.all,
      ],
      options
    ),
  })
}
