import {
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
  OrderPreviewDTO,
  OrderWorkflow,
  PromotionDTO,
  ReturnDTO,
} from "@medusajs/framework/types"
import {
  ChangeActionType,
  deepFlatMap,
  isDefined,
  OrderChangeStatus,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { updateOrderExchangesStep } from "../../steps/exchange/update-order-exchanges"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import { createReturnsStep } from "../../steps/return/create-returns"
import { updateOrderChangesStep } from "../../steps/update-order-changes"
import {
  throwIfIsCancelled,
  throwIfItemsDoesNotExistsInOrder,
  throwIfManagedItemsNotStockedAtReturnLocation,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"
import { computeAdjustmentsForPreviewWorkflow } from "../compute-adjustments-for-preview"
import { refreshExchangeShippingWorkflow } from "./refresh-shipping"
import { fieldsToComputeAdjustmentsForPreview } from "../order-edit/utils/fields"

/**
 * The data to validate that items can be returned as part of an exchange.
 */
export type ExchangeRequestItemReturnValidationStepInput = {
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
   * The order return's details.
   */
  orderReturn: ReturnDTO
  /**
   * The items to be returned.
   */
  items: OrderWorkflow.OrderExchangeRequestItemReturnWorkflowInput["items"]
}

/**
 * This step validates that items can be returned as part of an exchange.
 * If the order, exchange, or return is canceled, the order change is not active,
 * or the item doesn't exist in the order, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, order exchange, and order return details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = exchangeRequestItemReturnValidationStep({
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
 *   orderReturn: {
 *     id: "return_123",
 *     // other order return details...
 *   },
 *   items: [
 *     {
 *       id: "orli_123",
 *       quantity: 1,
 *     }
 *   ]
 * })
 */
export const exchangeRequestItemReturnValidationStep = createStep(
  "exchange-request-item-return-validation",
  async function ({
    order,
    orderChange,
    orderReturn,
    orderExchange,
    items,
  }: ExchangeRequestItemReturnValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
    throwIfItemsDoesNotExistsInOrder({ order, inputItems: items })
    throwIfManagedItemsNotStockedAtReturnLocation({
      order,
      orderReturn,
      inputItems: items,
    })
  }
)

export const orderExchangeRequestItemReturnWorkflowId =
  "exchange-request-item-return"
/**
 * This workflow adds inbound items to be retuned as part of the exchange. It's used
 * by the [Add Inbound Items Admin API Route](https://docs.medusajs.com/api/admin#exchanges_postexchangesidinbounditems).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to add inbound items
 * to be returned as part of an exchange in your custom flow.
 *
 * @example
 * const { result } = await orderExchangeRequestItemReturnWorkflow(container)
 * .run({
 *   input: {
 *     exchange_id: "exchange_123",
 *     return_id: "return_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         quantity: 1,
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Add inbound items to be returned as part of the exchange.
 */
export const orderExchangeRequestItemReturnWorkflow = createWorkflow(
  orderExchangeRequestItemReturnWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderExchangeRequestItemReturnWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderExchange = useRemoteQueryStep({
      entry_point: "order_exchange",
      fields: ["id", "order_id", "return_id", "location_id", "canceled_at"],
      variables: { id: input.exchange_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "exchange-query" })

    const existingOrderReturn = when({ orderExchange }, ({ orderExchange }) => {
      return orderExchange.return_id
    }).then(() => {
      return useRemoteQueryStep({
        entry_point: "return",
        fields: ["id", "status", "order_id", "canceled_at"],
        variables: { id: orderExchange.return_id },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "return-query" }) as ReturnDTO
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: [
        ...fieldsToComputeAdjustmentsForPreview,
        "canceled_at",
        "status",
        "items.variant.manage_inventory",
        "items.variant.inventory_items.inventory_item_id",
        "items.variant.inventory_items.inventory.location_levels.location_id",
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
    }).config({
      name: "order-change-query",
      status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
    })

    const pickItemLocationId = transform(
      { order, input },
      ({ order, input }) => {
        if (input.location_id) {
          return input.location_id
        }

        // pick the first item location
        const item = order?.items?.find(
          (item) => item.id === input.items[0].id
        ) as any

        let locationId: string | undefined
        deepFlatMap(
          item,
          "variant.inventory_items.inventory.location_levels",
          ({ location_levels }) => {
            if (!locationId && isDefined(location_levels?.location_id)) {
              locationId = location_levels.location_id
            }
          }
        )
        return locationId
      }
    )

    const createdReturn = when({ orderExchange }, ({ orderExchange }) => {
      return !orderExchange.return_id
    }).then(() => {
      return createReturnsStep([
        {
          order_id: orderExchange.order_id,
          location_id: pickItemLocationId,
          exchange_id: orderExchange.id,
        },
      ])
    })

    const orderReturn: ReturnDTO = transform(
      { createdReturn, existingOrderReturn, orderExchange },
      ({ createdReturn, existingOrderReturn, orderExchange }) => {
        return existingOrderReturn ?? (createdReturn?.[0] as ReturnDTO)
      }
    )

    when({ createdReturn }, ({ createdReturn }) => {
      return !!createdReturn?.length
    }).then(() => {
      updateOrderChangesStep([
        {
          id: orderChange.id,
          return_id: createdReturn?.[0]?.id,
        },
      ])
    })

    exchangeRequestItemReturnValidationStep({
      order,
      items: input.items,
      orderExchange,
      orderReturn,
      orderChange,
    })

    when({ orderExchange }, ({ orderExchange }) => {
      return !orderExchange.return_id
    }).then(() => {
      updateOrderExchangesStep([
        {
          id: orderExchange.id,
          return: createdReturn?.[0]!.id,
        },
      ])
    })

    const orderChangeActionInput = transform(
      { order, orderChange, orderExchange, orderReturn, items: input.items },
      ({ order, orderChange, orderExchange, orderReturn, items }) => {
        return items.map((item) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          exchange_id: orderExchange.id,
          return_id: orderReturn.id,
          version: orderChange.version,
          action: ChangeActionType.RETURN_ITEM,
          internal_note: item.internal_note,
          reference: "return",
          reference_id: orderReturn.id,
          details: {
            reference_id: item.id,
            quantity: item.quantity,
            reason_id: item.reason_id,
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
