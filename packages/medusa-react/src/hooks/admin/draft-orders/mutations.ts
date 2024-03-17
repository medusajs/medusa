import {
  AdminDraftOrdersDeleteRes,
  AdminDraftOrdersRes,
  AdminPostDraftOrdersDraftOrderLineItemsItemReq,
  AdminPostDraftOrdersDraftOrderLineItemsReq,
  AdminPostDraftOrdersDraftOrderRegisterPaymentRes,
  AdminPostDraftOrdersDraftOrderReq,
  AdminPostDraftOrdersReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminDraftOrderKeys } from "./queries"

/**
 * This hook creates a Draft Order. A draft order is not transformed into an order until payment is captured.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateDraftOrder } from "medusa-react"
 *
 * type DraftOrderData = {
 *   email: string
 *   region_id: string
 *   items: {
 *     quantity: number,
 *     variant_id: string
 *   }[]
 *   shipping_methods: {
 *     option_id: string
 *     price: number
 *   }[]
 * }
 *
 * const CreateDraftOrder = () => {
 *   const createDraftOrder = useAdminCreateDraftOrder()
 *   // ...
 *
 *   const handleCreate = (data: DraftOrderData) => {
 *     createDraftOrder.mutate(data, {
 *       onSuccess: ({ draft_order }) => {
 *         console.log(draft_order.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateDraftOrder
 *
 * @customNamespace Hooks.Admin.Draft Orders
 * @category Mutations
 */
export const useAdminCreateDraftOrder = (
  options?: UseMutationOptions<
    Response<AdminDraftOrdersRes>,
    Error,
    AdminPostDraftOrdersReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostDraftOrdersReq) =>
      client.admin.draftOrders.create(payload),
    ...buildOptions(queryClient, adminDraftOrderKeys.lists(), options),
  })
}

/**
 * This hook updates a Draft Order's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateDraftOrder } from "medusa-react"
 *
 * type Props = {
 *   draftOrderId: string
 * }
 *
 * const DraftOrder = ({ draftOrderId }: Props) => {
 *   const updateDraftOrder = useAdminUpdateDraftOrder(
 *     draftOrderId
 *   )
 *   // ...
 *
 *   const handleUpdate = (email: string) => {
 *     updateDraftOrder.mutate({
 *       email,
 *     }, {
 *       onSuccess: ({ draft_order }) => {
 *         console.log(draft_order.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default DraftOrder
 *
 * @customNamespace Hooks.Admin.Draft Orders
 * @category Mutations
 */
export const useAdminUpdateDraftOrder = (
  /**
   * The draft order's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminDraftOrdersRes>,
    Error,
    AdminPostDraftOrdersDraftOrderReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostDraftOrdersDraftOrderReq) =>
      client.admin.draftOrders.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminDraftOrderKeys.detail(id), adminDraftOrderKeys.lists()],
      options
    ),
  })
}

/**
 * This hook deletes a Draft Order.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteDraftOrder } from "medusa-react"
 *
 * type Props = {
 *   draftOrderId: string
 * }
 *
 * const DraftOrder = ({ draftOrderId }: Props) => {
 *   const deleteDraftOrder = useAdminDeleteDraftOrder(
 *     draftOrderId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteDraftOrder.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default DraftOrder
 *
 * @customNamespace Hooks.Admin.Draft Orders
 * @category Mutations
 */
export const useAdminDeleteDraftOrder = (
  /**
   * The draft order's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminDraftOrdersDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => client.admin.draftOrders.delete(id),
    ...buildOptions(
      queryClient,
      [adminDraftOrderKeys.detail(id), adminDraftOrderKeys.lists()],
      options
    ),
  })
}

/**
 * This hook capture the draft order's payment. This will also set the draft order's status to `completed` and create an order from the draft order. The payment is captured through Medusa's system payment,
 * which is manual payment that isn't integrated with any third-party payment provider. It is assumed that the payment capturing is handled manually by the admin.
 *
 * @example
 * import React from "react"
 * import { useAdminDraftOrderRegisterPayment } from "medusa-react"
 *
 * type Props = {
 *   draftOrderId: string
 * }
 *
 * const DraftOrder = ({ draftOrderId }: Props) => {
 *   const registerPayment = useAdminDraftOrderRegisterPayment(
 *     draftOrderId
 *   )
 *   // ...
 *
 *   const handlePayment = () => {
 *     registerPayment.mutate(void 0, {
 *       onSuccess: ({ order }) => {
 *         console.log(order.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default DraftOrder
 *
 * @customNamespace Hooks.Admin.Draft Orders
 * @category Mutations
 */
export const useAdminDraftOrderRegisterPayment = (
  /**
   * The draft order's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminPostDraftOrdersDraftOrderRegisterPaymentRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => client.admin.draftOrders.markPaid(id),
    ...buildOptions(queryClient, adminDraftOrderKeys.detail(id), options),
  })
}

/**
 * This hook creates a Line Item in the Draft Order.
 *
 * @example
 * import React from "react"
 * import { useAdminDraftOrderAddLineItem } from "medusa-react"
 *
 * type Props = {
 *   draftOrderId: string
 * }
 *
 * const DraftOrder = ({ draftOrderId }: Props) => {
 *   const addLineItem = useAdminDraftOrderAddLineItem(
 *     draftOrderId
 *   )
 *   // ...
 *
 *   const handleAdd = (quantity: number) => {
 *     addLineItem.mutate({
 *       quantity,
 *     }, {
 *       onSuccess: ({ draft_order }) => {
 *         console.log(draft_order.cart)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default DraftOrder
 *
 * @customNamespace Hooks.Admin.Draft Orders
 * @category Mutations
 */
export const useAdminDraftOrderAddLineItem = (
  /**
   * The draft order's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminDraftOrdersRes>,
    Error,
    AdminPostDraftOrdersDraftOrderLineItemsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostDraftOrdersDraftOrderLineItemsReq) =>
      client.admin.draftOrders.addLineItem(id, payload),
    ...buildOptions(queryClient, adminDraftOrderKeys.detail(id), options),
  })
}

/**
 * This hook deletes a Line Item from a Draft Order.
 *
 * @typeParamDefinition string - The ID of the line item to remove.
 *
 * @example
 * import React from "react"
 * import { useAdminDraftOrderRemoveLineItem } from "medusa-react"
 *
 * type Props = {
 *   draftOrderId: string
 * }
 *
 * const DraftOrder = ({ draftOrderId }: Props) => {
 *   const deleteLineItem = useAdminDraftOrderRemoveLineItem(
 *     draftOrderId
 *   )
 *   // ...
 *
 *   const handleDelete = (itemId: string) => {
 *     deleteLineItem.mutate(itemId, {
 *       onSuccess: ({ draft_order }) => {
 *         console.log(draft_order.cart)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default DraftOrder
 *
 * @customNamespace Hooks.Admin.Draft Orders
 * @category Mutations
 */
export const useAdminDraftOrderRemoveLineItem = (
  /**
   * The draft order's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminDraftOrdersRes>, Error, string>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) =>
      client.admin.draftOrders.removeLineItem(id, itemId),
    ...buildOptions(queryClient, adminDraftOrderKeys.detail(id), options),
  })
}

/**
 * The details to update of the line item.
 */
export type AdminDraftOrderUpdateLineItemReq =
  AdminPostDraftOrdersDraftOrderLineItemsItemReq & {
    /**
     * The line item's ID to update.
     */
    item_id: string
  }

/**
 * This hook updates a Line Item in a Draft Order.
 *
 * @example
 * import React from "react"
 * import { useAdminDraftOrderUpdateLineItem } from "medusa-react"
 *
 * type Props = {
 *   draftOrderId: string
 * }
 *
 * const DraftOrder = ({ draftOrderId }: Props) => {
 *   const updateLineItem = useAdminDraftOrderUpdateLineItem(
 *     draftOrderId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     itemId: string,
 *     quantity: number
 *   ) => {
 *     updateLineItem.mutate({
 *       item_id: itemId,
 *       quantity,
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default DraftOrder
 *
 * @customNamespace Hooks.Admin.Draft Orders
 * @category Mutations
 */
export const useAdminDraftOrderUpdateLineItem = (
  /**
   * The draft order's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminDraftOrdersRes>,
    Error,
    AdminDraftOrderUpdateLineItemReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ item_id, ...payload }: AdminDraftOrderUpdateLineItemReq) =>
      client.admin.draftOrders.updateLineItem(id, item_id, payload),
    ...buildOptions(queryClient, adminDraftOrderKeys.detail(id), options),
  })
}
