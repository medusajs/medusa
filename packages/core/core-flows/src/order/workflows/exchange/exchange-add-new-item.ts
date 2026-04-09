import {
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
  OrderPreviewDTO,
  OrderWorkflow,
  PromotionDTO,
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
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { addOrderLineItemsWorkflow } from "../add-line-items"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"
import { computeAdjustmentsForPreviewWorkflow } from "../compute-adjustments-for-preview"
import { updateOrderTaxLinesWorkflow } from "../update-tax-lines"
import { refreshExchangeShippingWorkflow } from "./refresh-shipping"
import { fieldsToComputeAdjustmentsForPreview } from "../order-edit/utils/fields"

/**
 * The data to validate that new or outbound items can be added to an exchange.
 */
export type ExchangeAddNewItemValidationStepInput = {
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
}

/**
 * This step validates that new or outbound items can be added to an exchange.
 * If the order or exchange is canceled, or the order change is not active, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, order exchange, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = exchangeAddNewItemValidationStep({
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
 * })
 */
export const exchangeAddNewItemValidationStep = createStep(
  "exchange-add-new-item-validation",
  async function ({
    order,
    orderChange,
    orderExchange,
  }: ExchangeAddNewItemValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const orderExchangeAddNewItemWorkflowId = "exchange-add-new-item"
/**
 * This workflow adds new or outbound items to an exchange. It's used by the
 * [Add Outbound Items Admin API Route](https://docs.medusajs.com/api/admin#exchanges_postexchangesidoutbounditems).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to add new or outbound items
 * to an exchange in your custom flow.
 *
 * @example
 * const { result } = await orderExchangeAddNewItemWorkflow(container)
 * .run({
 *   input: {
 *     exchange_id: "exchange_123",
 *     items: [
 *       {
 *         variant_id: "variant_123",
 *         quantity: 1,
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Add new or outbound items to an exchange.
 */
export const orderExchangeAddNewItemWorkflow = createWorkflow(
  orderExchangeAddNewItemWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderExchangeAddNewItemWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderExchange = useRemoteQueryStep({
      entry_point: "order_exchange",
      fields: ["id", "order_id", "canceled_at"],
      variables: { id: input.exchange_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "exchange-query" })

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

    exchangeAddNewItemValidationStep({
      order,
      orderExchange,
      orderChange,
    })

    const lineItems = addOrderLineItemsWorkflow.runAsStep({
      input: {
        order_id: order.id,
        items: input.items,
      },
    })

    const lineItemIds = transform(lineItems, (lineItems) => {
      return lineItems.map((item) => item.id)
    })

    updateOrderTaxLinesWorkflow.runAsStep({
      input: {
        order_id: order.id,
        item_ids: lineItemIds,
      },
    })

    const orderChangeActionInput = transform(
      { order, orderChange, orderExchange, items: input.items, lineItems },
      ({ order, orderChange, orderExchange, items, lineItems }) => {
        return items.map((item, index) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          exchange_id: orderExchange.id,
          version: orderChange.version,
          action: ChangeActionType.ITEM_ADD,
          internal_note: item.internal_note,
          reference: "order_exchange",
          reference_id: orderExchange.id,
          details: {
            reference_id: lineItems[index].id,
            quantity: item.quantity,
            unit_price: item.unit_price ?? lineItems[index].unit_price,
            metadata: item.metadata,
          },
        }))
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: orderChangeActionInput,
    })

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

    refreshExchangeShippingWorkflow.runAsStep({
      input: refreshArgs,
    })

    return new WorkflowResponse(previewOrderChangeStep(orderExchange.order_id))
  }
)
