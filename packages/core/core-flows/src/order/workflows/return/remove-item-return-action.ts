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

/**
 * This step validates that a return item can be removed.
 */
export const removeReturnItemActionValidationStep = createStep(
  "remove-item-return-action-validation",
  async function ({
    order,
    orderChange,
    orderReturn,
    input,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderChange: OrderChangeDTO
    input: OrderWorkflow.DeleteRequestItemReturnWorkflowInput
  }) {
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
 * This workflow removes a return item.
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
      fields: ["actions.action", "actions.return_id", "actions.id"],
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

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
