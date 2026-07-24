import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  deleteOrderChangeActionsStep,
  previewOrderChangeStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { removeReturnShippingMethodWorkflow } from "./remove-return-shipping-method"
import { updateReturnWorkflow } from "./update-return"
import { refreshReturnShippingWorkflow } from "./refresh-shipping"

/**
 * The data to validate that a return item can be removed.
 */
export type RemoveItemReturnActionValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The return's details.
   */
  orderReturn: ReturnDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The details of the item to be removed.
   */
  input: OrderWorkflow.DeleteRequestItemReturnWorkflowInput
}

/**
 * This step validates that a return item can be removed.
 * If the order or return is canceled, the order change is not active,
 * the return request is not found,
 * or the action is not a request return action, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, return, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = removeReturnItemActionValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderReturn: {
 *     id: "return_123",
 *     // other return details...
 *   },
 *   input: {
 *     return_id: "return_123",
 *     action_id: "orchac_123",
 *   }
 * })
 */
export const removeReturnItemActionValidationStep = createStep(
  "remove-item-return-action-validation",
  async function ({
    order,
    orderChange,
    orderReturn,
    input,
  }: RemoveItemReturnActionValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No request return found for return ${input.return_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.RETURN_ITEM) {
      throw new Error(
        `Action ${associatedAction.id} is not requesting item return`
      )
    }
  }
)

export const removeItemReturnActionWorkflowId = "remove-item-return-action"
/**
 * This workflow removes a return item. It's used by the
 * [Remove Item from Return Admin API Route](https://docs.medusajs.com/api/admin/returns/remove-item).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to remove an item from a return request in your custom flows.
 *
 * @example
 * const { result } = await removeItemReturnActionWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *     action_id: "orchac_123",
 *   }
 * })
 *
 * @summary
 *
 * Remove an item from a return.
 */
export const removeItemReturnActionWorkflow = createWorkflow(
  removeItemReturnActionWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteRequestItemReturnWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at", "items.*"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "id",
        "status",
        "version",
        "return_id",
        "order_id",
        "actions.*",
        "canceled_at",
        "confirmed_at",
        "declined_at",
      ],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    removeReturnItemActionValidationStep({
      order,
      input,
      orderReturn,
      orderChange,
    })

    deleteOrderChangeActionsStep({ ids: [input.action_id] })

    const updatedOrderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "actions.id",
        "actions.action",
        "actions.order_id",
        "actions.return_id",
        "actions.claim_id",
        "actions.exchange_id",
        "actions.reference",
        "actions.reference_id",
        "actions.order_change_id",
      ],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "updated-order-change-query" })

    const actionIdToDelete = transform(
      { updatedOrderChange, orderReturn },
      ({
        updatedOrderChange: { actions = [] },
        orderReturn: { id: returnId },
      }) => {
        const itemActions = actions.filter((c) => c.action === "RETURN_ITEM")

        if (itemActions.length) {
          return null
        }

        const shippingAction = actions.find(
          (c) => c.action === "SHIPPING_ADD" && c.return_id === returnId
        )

        if (!shippingAction) {
          return null
        }

        return shippingAction.id
      }
    )

    when({ actionIdToDelete }, ({ actionIdToDelete }) => {
      return !!actionIdToDelete
    }).then(() => {
      removeReturnShippingMethodWorkflow.runAsStep({
        input: {
          return_id: orderReturn.id!,
          action_id: actionIdToDelete,
        },
      })

      updateReturnWorkflow.runAsStep({
        input: {
          return_id: orderReturn.id,
          location_id: null,
        },
      })
    })

    when({ actionIdToDelete }, ({ actionIdToDelete }) => {
      return !actionIdToDelete
    }).then(() => {
      const refreshArgs = transform(
        { orderChange, orderReturn },
        ({ orderChange, orderReturn }) => {
          return {
            order_change_id: orderChange.id,
            return_id: orderReturn.id,
            order_id: orderReturn.order_id,
          }
        }
      )

      refreshReturnShippingWorkflow.runAsStep({
        input: refreshArgs,
      })
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
