import {
  BigNumberInput,
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
} from "@medusajs/framework/types"
import {
  ChangeActionType,
  deduplicate,
  MathBN,
  OrderChangeStatus,
  OrderEditWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { reserveInventoryStep } from "../../../cart/steps/reserve-inventory"
import {
  prepareConfirmInventoryInput,
  requiredOrderFieldsForInventoryConfirmation,
} from "../../../cart/utils/prepare-confirm-inventory-input"
import { emitEventStep, useQueryGraphStep } from "../../../common"
import { acquireLockStep, releaseLockStep } from "../../../locking"
import { deleteReservationsByLineItemsStep } from "../../../reservation"
import { previewOrderChangeStep } from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { createOrUpdateOrderPaymentCollectionWorkflow } from "../create-or-update-order-payment-collection"
import { fieldsToRefreshOrderEdit } from "./utils/fields"

/**
 * The data to validate that a requested order edit can be confirmed.
 */
export type ConfirmOrderEditRequestValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
}

/**
 * This step validates that a requested order edit can be confirmed.
 * If the order is canceled or the order change is not active, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = confirmOrderEditRequestValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   }
 * })
 */
export const confirmOrderEditRequestValidationStep = createStep(
  "validate-confirm-order-edit-request",
  async function ({
    order,
    orderChange,
  }: ConfirmOrderEditRequestValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

/**
 * The data to confirm an order edit request.
 */
export type ConfirmOrderEditRequestWorkflowInput = {
  /**
   * The ID of the order to confirm the edit for.
   */
  order_id: string
  /**
   * The ID of the user confirming the edit.
   */
  confirmed_by?: string
}

export const confirmOrderEditRequestWorkflowId = "confirm-order-edit-request"
/**
 * This workflow confirms an order edit request. It's used by the
 * [Confirm Order Edit Admin API Route](https://docs.medusajs.com/api/admin#order-edits_postordereditsidconfirm).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to confirm an order edit
 * in your custom flow.
 *
 * @example
 * const { result } = await confirmOrderEditRequestWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *   }
 * })
 *
 * @summary
 *
 * Confirm an order edit request.
 */
export const confirmOrderEditRequestWorkflow = createWorkflow(
  confirmOrderEditRequestWorkflowId,
  function (
    input: ConfirmOrderEditRequestWorkflowInput
  ): WorkflowResponse<OrderPreviewDTO> {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const orderResult = useQueryGraphStep({
      entity: "order",
      fields: fieldsToRefreshOrderEdit,
      filters: { id: input.order_id },
      options: {
        throwIfKeyNotFound: true,
      },
    }).config({ name: "order-query" })

    const order = transform({ orderResult }, ({ orderResult }) => {
      return orderResult.data[0]
    })

    const orderChangeResult = useQueryGraphStep({
      entity: "order_change",
      fields: [
        "id",
        "status",
        "actions.id",
        "actions.order_id",
        "actions.return_id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
      ],
      filters: {
        order_id: input.order_id,
        status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
      },
    }).config({ name: "order-change-query" })

    const orderChange = transform(
      { orderChangeResult },
      ({ orderChangeResult }) => {
        return orderChangeResult.data[0]
      }
    )

    confirmOrderEditRequestValidationStep({
      order,
      orderChange,
    })

    const orderPreview = previewOrderChangeStep(order.id)

    confirmOrderChanges({
      changes: [orderChange],
      orderId: order.id,
      confirmed_by: input.confirmed_by,
    })

    const { data: refreshedOrder } = useQueryGraphStep({
      entity: "order",
      fields: deduplicate([
        ...requiredOrderFieldsForInventoryConfirmation,
        ...fieldsToRefreshOrderEdit,
      ]),
      filters: { id: input.order_id },
      options: {
        throwIfKeyNotFound: true,
        isList: false,
      },
    }).config({ name: "order-items-query" })

    const { variants, items, toRemoveReservationLineItemIds } = transform(
      { refreshedOrder, previousOrderItems: order.items, orderPreview },
      ({ refreshedOrder, previousOrderItems, orderPreview }) => {
        const allItems: any[] = []
        const allVariants: any[] = []

        const previousItemIds = (previousOrderItems || []).map(({ id }) => id)
        const currentItemIds = refreshedOrder.items.map(({ id }) => id)

        const removedItemIds = previousItemIds.filter(
          (id) => !currentItemIds.includes(id)
        )

        const updatedItemIds: string[] = []

        refreshedOrder.items.forEach((ordItem) => {
          const itemAction = orderPreview.items?.find(
            (item) =>
              item.id === ordItem.id &&
              item.actions?.find(
                (a) =>
                  a.action === ChangeActionType.ITEM_ADD ||
                  a.action === ChangeActionType.ITEM_UPDATE
              )
          )

          if (!itemAction) {
            return
          }

          const updateAction = itemAction.actions!.find(
            (a) => a.action === ChangeActionType.ITEM_UPDATE
          )

          if (updateAction) {
            updatedItemIds.push(ordItem.id)
          }

          const newQuantity: BigNumberInput =
            itemAction.raw_quantity ?? itemAction.quantity

          const reservationQuantity = MathBN.sub(
            newQuantity,
            ordItem.raw_fulfilled_quantity
          )

          allItems.push({
            id: ordItem.id,
            variant_id: ordItem.variant_id,
            quantity: reservationQuantity,
          })
          allVariants.push(ordItem.variant)
        })

        return {
          variants: allVariants,
          items: allItems,
          toRemoveReservationLineItemIds: [
            ...removedItemIds,
            ...updatedItemIds,
          ],
        }
      }
    )

    const formatedInventoryItems = transform(
      {
        input: {
          sales_channel_id: (refreshedOrder as any).sales_channel_id,
          variants,
          items,
        },
      },
      prepareConfirmInventoryInput
    )

    deleteReservationsByLineItemsStep(toRemoveReservationLineItemIds)
    reserveInventoryStep(formatedInventoryItems)

    createOrUpdateOrderPaymentCollectionWorkflow.runAsStep({
      input: {
        order_id: order.id,
      },
    })

    const eventData = transform(
      { order, orderChange },
      ({ order, orderChange }) => {
        return {
          order_id: order.id,
          actions: orderChange.actions,
        }
      }
    )

    emitEventStep({
      eventName: OrderEditWorkflowEvents.CONFIRMED,
      data: eventData,
    })

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(orderPreview)
  }
)
