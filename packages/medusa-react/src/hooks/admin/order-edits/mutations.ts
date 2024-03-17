import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import {
  AdminOrderEditDeleteRes,
  AdminOrderEditItemChangeDeleteRes,
  AdminOrderEditsRes,
  AdminPostOrderEditsEditLineItemsLineItemReq,
  AdminPostOrderEditsEditLineItemsReq,
  AdminPostOrderEditsOrderEditReq,
  AdminPostOrderEditsReq,
} from "@medusajs/medusa"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminOrderKeys } from "../orders"
import { adminOrderEditsKeys } from "./queries"

/**
 * This hook creates an order edit.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateOrderEdit } from "medusa-react"
 *
 * const CreateOrderEdit = () => {
 *   const createOrderEdit = useAdminCreateOrderEdit()
 *
 *   const handleCreateOrderEdit = (orderId: string) => {
 *     createOrderEdit.mutate({
 *       order_id: orderId,
 *     }, {
 *       onSuccess: ({ order_edit }) => {
 *         console.log(order_edit.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateOrderEdit
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Mutations
 */
export const useAdminCreateOrderEdit = (
  options?: UseMutationOptions<
    Response<AdminOrderEditsRes>,
    Error,
    AdminPostOrderEditsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostOrderEditsReq) =>
      client.admin.orderEdits.create(payload),
    ...buildOptions(
      queryClient,
      [adminOrderEditsKeys.lists(), adminOrderKeys.details()],
      options
    ),
  })
}

/**
 * This hook deletes an order edit. Only order edits that have the status `created` can be deleted.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteOrderEdit } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 * }
 *
 * const OrderEdit = ({ orderEditId }: Props) => {
 *   const deleteOrderEdit = useAdminDeleteOrderEdit(
 *     orderEditId
 *   )
 *
 *   const handleDelete = () => {
 *     deleteOrderEdit.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default OrderEdit
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Mutations
 */
export const useAdminDeleteOrderEdit = (
  /**
   * Order Edit's ID
   */
  id: string,
  options?: UseMutationOptions<Response<AdminOrderEditDeleteRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.orderEdits.delete(id),
    ...buildOptions(
      queryClient,
      [
        adminOrderEditsKeys.detail(id),
        adminOrderEditsKeys.lists(),
        adminOrderKeys.details(),
      ],
      options
    ),
  })
}

/**
 * This hook deletes a line item change that indicates the addition, deletion, or update of a line item in the original order.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteOrderEditItemChange } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 *   itemChangeId: string
 * }
 *
 * const OrderEditItemChange = ({
 *   orderEditId,
 *   itemChangeId
 * }: Props) => {
 *   const deleteItemChange = useAdminDeleteOrderEditItemChange(
 *     orderEditId,
 *     itemChangeId
 *   )
 *
 *   const handleDeleteItemChange = () => {
 *     deleteItemChange.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default OrderEditItemChange
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Mutations
 */
export const useAdminDeleteOrderEditItemChange = (
  /**
   * The order edit's ID.
   */
  orderEditId: string,
  /**
   * The line item change's ID.
   */
  itemChangeId: string,
  options?: UseMutationOptions<
    Response<AdminOrderEditItemChangeDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      client.admin.orderEdits.deleteItemChange(orderEditId, itemChangeId),
    ...buildOptions(
      queryClient,
      [adminOrderEditsKeys.detail(orderEditId), adminOrderEditsKeys.lists()],
      options
    ),
  })
}

/**
 * This hook creates or updates a line item change in the order edit that indicates addition, deletion, or update of a line item
 * into an original order. Line item changes are only reflected on the original order after the order edit is confirmed.
 *
 * @example
 * import React from "react"
 * import { useAdminOrderEditUpdateLineItem } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 *   itemId: string
 * }
 *
 * const OrderEditItemChange = ({
 *   orderEditId,
 *   itemId
 * }: Props) => {
 *   const updateLineItem = useAdminOrderEditUpdateLineItem(
 *     orderEditId,
 *     itemId
 *   )
 *
 *   const handleUpdateLineItem = (quantity: number) => {
 *     updateLineItem.mutate({
 *       quantity,
 *     }, {
 *       onSuccess: ({ order_edit }) => {
 *         console.log(order_edit.items)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default OrderEditItemChange
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Mutations
 */
export const useAdminOrderEditUpdateLineItem = (
  /**
   * The order edit's ID.
   */
  orderEditId: string,
  /**
   * The line item's ID.
   */
  itemId: string,
  options?: UseMutationOptions<
    Response<AdminOrderEditsRes>,
    Error,
    AdminPostOrderEditsEditLineItemsLineItemReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostOrderEditsEditLineItemsLineItemReq) =>
      client.admin.orderEdits.updateLineItem(orderEditId, itemId, payload),
    ...buildOptions(
      queryClient,
      [adminOrderEditsKeys.detail(orderEditId), adminOrderEditsKeys.lists()],
      options
    ),
  })
}

/**
 * This hook creates a line item change in the order edit that indicates deleting an item in the original order.
 * The item in the original order will not be deleted until the order edit is confirmed.
 *
 * @example
 * import React from "react"
 * import { useAdminOrderEditDeleteLineItem } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 *   itemId: string
 * }
 *
 * const OrderEditLineItem = ({
 *   orderEditId,
 *   itemId
 * }: Props) => {
 *   const removeLineItem = useAdminOrderEditDeleteLineItem(
 *     orderEditId,
 *     itemId
 *   )
 *
 *   const handleRemoveLineItem = () => {
 *     removeLineItem.mutate(void 0, {
 *       onSuccess: ({ order_edit }) => {
 *         console.log(order_edit.changes)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default OrderEditLineItem
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Mutations
 */
export const useAdminOrderEditDeleteLineItem = (
  /**
   * The order edit's ID.
   */
  orderEditId: string,
  /**
   * The line item's ID.
   */
  itemId: string,
  options?: UseMutationOptions<Response<AdminOrderEditsRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      client.admin.orderEdits.removeLineItem(orderEditId, itemId),
    ...buildOptions(
      queryClient,
      [adminOrderEditsKeys.detail(orderEditId), adminOrderEditsKeys.lists()],
      options
    ),
  })
}

/**
 * This hook updates an Order Edit's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateOrderEdit } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 * }
 *
 * const OrderEdit = ({ orderEditId }: Props) => {
 *   const updateOrderEdit = useAdminUpdateOrderEdit(
 *     orderEditId,
 *   )
 *
 *   const handleUpdate = (
 *     internalNote: string
 *   ) => {
 *     updateOrderEdit.mutate({
 *       internal_note: internalNote
 *     }, {
 *       onSuccess: ({ order_edit }) => {
 *         console.log(order_edit.internal_note)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default OrderEdit
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Mutations
 */
export const useAdminUpdateOrderEdit = (
  /**
   * The order edit's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminOrderEditsRes>,
    Error,
    AdminPostOrderEditsOrderEditReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostOrderEditsOrderEditReq) =>
      client.admin.orderEdits.update(id, payload),
    ...buildOptions(
      queryClient,
      [
        adminOrderEditsKeys.lists(),
        adminOrderEditsKeys.detail(id),
        adminOrderKeys.details(),
      ],
      options
    ),
  })
}

/**
 * This hook creates a line item change in the order edit that indicates adding an item in the original order.
 * The item will not be added to the original order until the order edit is confirmed.
 *
 * @example
 * import React from "react"
 * import { useAdminOrderEditAddLineItem } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 * }
 *
 * const OrderEdit = ({ orderEditId }: Props) => {
 *   const addLineItem = useAdminOrderEditAddLineItem(
 *     orderEditId
 *   )
 *
 *   const handleAddLineItem =
 *     (quantity: number, variantId: string) => {
 *       addLineItem.mutate({
 *         quantity,
 *         variant_id: variantId,
 *       }, {
 *         onSuccess: ({ order_edit }) => {
 *           console.log(order_edit.changes)
 *         }
 *       })
 *     }
 *
 *   // ...
 * }
 *
 * export default OrderEdit
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Mutations
 */
export const useAdminOrderEditAddLineItem = (
  /**
   * The order edit's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminOrderEditsRes>,
    Error,
    AdminPostOrderEditsEditLineItemsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminPostOrderEditsEditLineItemsReq) =>
      client.admin.orderEdits.addLineItem(id, payload),
    ...buildOptions(
      queryClient,
      [adminOrderEditsKeys.lists(), adminOrderEditsKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook requests customer confirmation of an order edit. This would emit the event `order-edit.requested` which Notification Providers listen to and send
 * a notification to the customer about the order edit.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminRequestOrderEditConfirmation,
 * } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 * }
 *
 * const OrderEdit = ({ orderEditId }: Props) => {
 *   const requestOrderConfirmation =
 *     useAdminRequestOrderEditConfirmation(
 *       orderEditId
 *     )
 *
 *   const handleRequestConfirmation = () => {
 *     requestOrderConfirmation.mutate(void 0, {
 *       onSuccess: ({ order_edit }) => {
 *         console.log(
 *           order_edit.requested_at,
 *           order_edit.requested_by
 *         )
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default OrderEdit
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Mutations
 */
export const useAdminRequestOrderEditConfirmation = (
  /**
   * The order edit's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminOrderEditsRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.orderEdits.requestConfirmation(id),
    ...buildOptions(
      queryClient,
      [
        adminOrderEditsKeys.lists(),
        adminOrderEditsKeys.detail(id),
        adminOrderKeys.details(),
      ],
      options
    ),
  })
}

/**
 * This hook cancels an order edit.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminCancelOrderEdit,
 * } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 * }
 *
 * const OrderEdit = ({ orderEditId }: Props) => {
 *   const cancelOrderEdit =
 *     useAdminCancelOrderEdit(
 *       orderEditId
 *     )
 *
 *   const handleCancel = () => {
 *     cancelOrderEdit.mutate(void 0, {
 *       onSuccess: ({ order_edit }) => {
 *         console.log(
 *           order_edit.id
 *         )
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default OrderEdit
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Mutations
 */
export const useAdminCancelOrderEdit = (
  /**
   * The order edit's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminOrderEditsRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.orderEdits.cancel(id),
    ...buildOptions(
      queryClient,
      [
        adminOrderEditsKeys.lists(),
        adminOrderEditsKeys.detail(id),
        adminOrderKeys.details(),
      ],
      options
    ),
  })
}

/**
 * This hook confirms an order edit. This will reflect the changes in the order edit on the associated order.
 *
 * @example
 * import React from "react"
 * import { useAdminConfirmOrderEdit } from "medusa-react"
 *
 * type Props = {
 *   orderEditId: string
 * }
 *
 * const OrderEdit = ({ orderEditId }: Props) => {
 *   const confirmOrderEdit = useAdminConfirmOrderEdit(
 *     orderEditId
 *   )
 *
 *   const handleConfirmOrderEdit = () => {
 *     confirmOrderEdit.mutate(void 0, {
 *       onSuccess: ({ order_edit }) => {
 *         console.log(
 *           order_edit.confirmed_at,
 *           order_edit.confirmed_by
 *         )
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default OrderEdit
 *
 * @customNamespace Hooks.Admin.Order Edits
 * @category Mutations
 */
export const useAdminConfirmOrderEdit = (
  /**
   * The order edit's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminOrderEditsRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.orderEdits.confirm(id),
    ...buildOptions(
      queryClient,
      [
        adminOrderEditsKeys.lists(),
        adminOrderEditsKeys.detail(id),
        adminOrderKeys.details(),
      ],
      options
    ),
  })
}
