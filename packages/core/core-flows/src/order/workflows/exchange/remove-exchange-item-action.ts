import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
  OrderPreviewDTO,
  OrderWorkflow,
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
import { removeExchangeShippingMethodWorkflow } from "./remove-exchange-shipping-method"

/**
 * This step validates that a new item can be removed from an exchange.
 */
export const removeExchangeItemActionValidationStep = createStep(
  "remove-item-exchange-action-validation",
  async function ({
    order,
    orderChange,
    orderExchange,
    input,
  }: {
    order: OrderDTO
    orderExchange: OrderExchangeDTO
    orderChange: OrderChangeDTO
    input: OrderWorkflow.DeleteOrderExchangeItemActionWorkflowInput
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No item exchange found for exchange ${input.exchange_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.ITEM_ADD) {
      throw new Error(`Action ${associatedAction.id} is not adding an item`)
    }
  }
)

export const removeItemExchangeActionWorkflowId = "remove-item-exchange-action"
/**
 * This workflow removes a new item in an exchange.
 */
export const removeItemExchangeActionWorkflow = createWorkflow(
  removeItemExchangeActionWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteOrderExchangeItemActionWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderExchange: OrderExchangeDTO = useRemoteQueryStep({
      entry_point: "order_exchange",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.exchange_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at", "items.*"],
      variables: { id: orderExchange.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderExchange.order_id,
          exchange_id: orderExchange.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    removeExchangeItemActionValidationStep({
      order,
      input,
      orderExchange,
      orderChange,
    })

    deleteOrderChangeActionsStep({ ids: [input.action_id] })

    const updatedOrderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "actions.action",
        "actions.id",
        "actions.exchange_id",
        "actions.return_id",
      ],
      variables: {
        filters: {
          order_id: orderExchange.order_id,
          exchange_id: orderExchange.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "updated-order-change-query" })

    const actionIdToDelete = transform(
      { updatedOrderChange, orderExchange },
      ({
        updatedOrderChange: { actions = [] },
        orderExchange: { id: orderExchangeId },
      }) => {
        const itemActions = actions.filter((c) => c.action === "ITEM_ADD")

        if (itemActions.length) {
          return null
        }

        const shippingAction = actions.find(
          (c) =>
            c.action === "SHIPPING_ADD" &&
            c.exchange_id === orderExchangeId &&
            !c.return_id
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
      removeExchangeShippingMethodWorkflow.runAsStep({
        input: {
          exchange_id: orderExchange.id!,
          action_id: actionIdToDelete,
        },
      })
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
