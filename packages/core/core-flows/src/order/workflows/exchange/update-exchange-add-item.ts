import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
  PromotionDTO,
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
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  previewOrderChangeStep,
  updateOrderChangeActionsStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { refreshExchangeShippingWorkflow } from "./refresh-shipping"
import { computeAdjustmentsForPreviewWorkflow } from "../compute-adjustments-for-preview"
import { fieldsToComputeAdjustmentsForPreview } from "../order-edit/utils/fields"

/**
 * The data to validate that an outbound or new item in an exchange can be updated.
 */
export type UpdateExchangeAddItemValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The order exchange's details.
   */
  orderExchange: OrderExchangeDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The details of the item update.
   */
  input: OrderWorkflow.UpdateExchangeAddNewItemWorkflowInput
}

/**
 * This step validates that an outbound or new item can be removed from an exchange.
 * If the order or exchange is canceled, the item is not found in the exchange,
 * or the order change is not active, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, order exchange, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = updateExchangeAddItemValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderExchange: {
 *     id: "exchange_123",
 *     // other order exchange details...
 *   },
 *   input: {
 *     exchange_id: "exchange_123",
 *     action_id: "orchact_123",
 *     data: {
 *       quantity: 1
 *     }
 *   }
 * })
 */
export const updateExchangeAddItemValidationStep = createStep(
  "update-exchange-add-item-validation",
  async function (
    {
      order,
      orderChange,
      orderExchange,
      input,
    }: UpdateExchangeAddItemValidationStepInput,
    context
  ) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No request to add item for exchange ${input.exchange_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.ITEM_ADD) {
      throw new Error(`Action ${associatedAction.id} is not adding an item`)
    }
  }
)

export const updateExchangeAddItemWorkflowId = "update-exchange-add-item"
/**
 * This workflow updates an outbound or new item in the exchange. It's used by the
 * [Update Outbound Item Admin API Route](https://docs.medusajs.com/api/admin#exchanges_postexchangesidoutbounditemsaction_id).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to update an outbound or new item
 * in an exchange in your custom flow.
 *
 * @example
 * const { result } = await updateExchangeAddItemWorkflow(container)
 * .run({
 *   input: {
 *     exchange_id: "exchange_123",
 *     action_id: "orchact_123",
 *     data: {
 *       quantity: 1
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update an outbound or new item in an exchange.
 */
export const updateExchangeAddItemWorkflow = createWorkflow(
  updateExchangeAddItemWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateExchangeAddNewItemWorkflowInput>
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
      fields: [
        ...fieldsToComputeAdjustmentsForPreview,
        "status",
        "canceled_at",
      ],
      variables: { id: orderExchange.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "id",
        "status",
        "version",
        "exchange_id",
        "actions.*",
        "carry_over_promotions",
      ],
      variables: {
        filters: {
          order_id: orderExchange.order_id,
          exchange_id: orderExchange.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    updateExchangeAddItemValidationStep({
      order,
      input,
      orderExchange,
      orderChange,
    })

    const updateData = transform(
      { orderChange, input },
      ({ input, orderChange }) => {
        const originalAction = (orderChange.actions ?? []).find(
          (a) => a.id === input.action_id
        ) as OrderChangeActionDTO

        const data = input.data
        return {
          id: input.action_id,
          details: {
            quantity: data.quantity ?? originalAction.details?.quantity,
          },
          internal_note: data.internal_note,
        }
      }
    )

    updateOrderChangeActionsStep([updateData])

    const refreshArgs = transform(
      { orderChange, orderExchange },
      ({ orderChange, orderExchange }) => {
        return {
          order_change_id: orderChange.id,
          exchange_id: orderExchange.id,
          order_id: orderExchange.order_id,
        }
      }
    )

    const orderWithPromotions = transform({ order }, ({ order }) => {
      return {
        ...order,
        promotions: (order as any).promotions ?? [],
      } as OrderDTO & { promotions: PromotionDTO[] }
    })

    computeAdjustmentsForPreviewWorkflow.runAsStep({
      input: {
        order: orderWithPromotions,
        orderChange,
      },
    })

    refreshExchangeShippingWorkflow.runAsStep({
      input: refreshArgs,
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
