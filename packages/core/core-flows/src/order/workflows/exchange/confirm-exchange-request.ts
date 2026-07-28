import {
  FulfillmentWorkflow,
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
  OrderExchangeItemDTO,
  OrderPreviewDTO,
  OrderReturnItemDTO,
} from "@medusajs/framework/types"
import {
  ChangeActionType,
  MedusaError,
  Modules,
  OrderChangeStatus,
  OrderWorkflowEvents,
  ReservationItemWorkflowEvents,
  ReturnStatus,
} from "@medusajs/framework/utils"
import {
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { reserveInventoryStep } from "../../../cart/steps/reserve-inventory"
import { prepareConfirmInventoryInput } from "../../../cart/utils/prepare-confirm-inventory-input"
import {
  createRemoteLinkStep,
  emitEventStep,
  useRemoteQueryStep,
} from "../../../common"
import { createReturnFulfillmentWorkflow } from "../../../fulfillment/workflows/create-return-fulfillment"
import { previewOrderChangeStep, updateReturnsStep } from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import { createOrderExchangeItemsFromActionsStep } from "../../steps/exchange/create-exchange-items-from-actions"
import { createReturnItemsFromActionsStep } from "../../steps/return/create-return-items-from-actions"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { createOrUpdateOrderPaymentCollectionWorkflow } from "../create-or-update-order-payment-collection"

/**
 * The data to validate that a requested exchange can be confirmed.
 */
export type ConfirmExchangeRequestValidationStepInput = {
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
 * This step validates that a requested exchange can be confirmed.
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
 * const data = confirmExchangeRequestValidationStep({
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
export const confirmExchangeRequestValidationStep = createStep(
  "validate-confirm-exchange-request",
  async function ({
    order,
    orderChange,
    orderExchange,
  }: ConfirmExchangeRequestValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

/**
 * This step confirms that a requested exchange has at least one item to return or send
 */
const confirmIfExchangeItemsArePresent = createStep(
  "confirm-if-exchange-items-are-present",
  async function ({
    exchangeItems,
    returnItems,
  }: {
    exchangeItems: OrderExchangeItemDTO[]
    returnItems?: OrderReturnItemDTO[]
  }) {
    if (exchangeItems.length > 0 && (returnItems || []).length > 0) {
      return
    }

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Order exchange request should have at least 1 item inbound and 1 item outbound`
    )
  }
)

function prepareFulfillmentData({
  order,
  items,
  shippingOption,
  deliveryAddress,
}: {
  order: OrderDTO
  items: any[]
  shippingOption: {
    id: string
    provider_id: string
    service_zone: {
      fulfillment_set: {
        location?: {
          id: string
          address: Record<string, any>
        }
      }
    }
  }
  deliveryAddress?: Record<string, any>
}) {
  const orderItemsMap = new Map<string, Required<OrderDTO>["items"][0]>(
    order.items!.map((i) => [i.id, i])
  )
  const fulfillmentItems = items.map((i) => {
    const orderItem = orderItemsMap.get(i.id) ?? i.item
    return {
      line_item_id: i.item_id,
      quantity: i.quantity,
      title: orderItem.variant_title ?? orderItem.title,
      sku: orderItem.variant_sku || "",
      barcode: orderItem.variant_barcode || "",
    } as FulfillmentWorkflow.CreateFulfillmentItemWorkflowDTO
  })

  const locationId = shippingOption.service_zone.fulfillment_set.location?.id!

  // delivery address is the stock location address
  const address =
    deliveryAddress ??
    shippingOption.service_zone.fulfillment_set.location?.address ??
    {}

  delete address.id

  return {
    input: {
      location_id: locationId,
      provider_id: shippingOption.provider_id,
      shipping_option_id: shippingOption.id,
      items: fulfillmentItems,
      delivery_address: address,
      order: order,
    },
  }
}

function transformActionsToItems({ orderChange }) {
  const exchangeItems: OrderChangeActionDTO[] = []
  const returnItems: OrderChangeActionDTO[] = []

  const actions = orderChange.actions ?? []
  actions.forEach((item) => {
    if (item.action === ChangeActionType.RETURN_ITEM) {
      returnItems.push(item)
    } else if (item.action === ChangeActionType.ITEM_ADD) {
      exchangeItems.push(item)
    }
  })

  return {
    exchangeItems: {
      changes: exchangeItems,
      exchangeId: exchangeItems?.[0]?.exchange_id!,
    },
    returnItems: {
      changes: returnItems,
      returnId: returnItems?.[0]?.return_id!,
    },
  }
}

function extractShippingOption({ orderPreview, orderExchange, returnId }) {
  if (!orderPreview.shipping_methods?.length) {
    return
  }

  let returnShippingMethod
  let exchangeShippingMethod
  for (const shippingMethod of orderPreview.shipping_methods) {
    const modifiedShippingMethod_ = shippingMethod as any
    if (!modifiedShippingMethod_.actions) {
      continue
    }

    for (const action of modifiedShippingMethod_.actions) {
      if (action.action === ChangeActionType.SHIPPING_ADD) {
        if (action.return_id === returnId) {
          returnShippingMethod = shippingMethod
        } else if (action.exchange_id === orderExchange.id) {
          exchangeShippingMethod = shippingMethod
        }
      }
    }
  }

  return {
    returnShippingMethod,
    exchangeShippingMethod,
  }
}

function getUpdateReturnData({ returnId }: { returnId: string }) {
  return transform({ returnId }, ({ returnId }) => {
    return [
      {
        id: returnId,
        status: ReturnStatus.REQUESTED,
        requested_at: new Date(),
      },
    ]
  })
}

/**
 * The details to confirm an exchange request.
 */
export type ConfirmExchangeRequestWorkflowInput = {
  /**
   * The ID of the exchange to confirm.
   */
  exchange_id: string
  /**
   * The ID of the user that's confirming the exchange.
   */
  confirmed_by?: string
}

export const confirmExchangeRequestWorkflowId = "confirm-exchange-request"
/**
 * This workflow confirms an exchange request. It's used by the
 * [Confirm Exchange Admin API Route](https://docs.medusajs.com/api/admin/exchanges/confirm-an-exchange).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to confirm an exchange
 * for an order in your custom flow.
 *
 * @example
 * const { result } = await confirmExchangeRequestWorkflow(container)
 * .run({
 *   input: {
 *     exchange_id: "exchange_123",
 *   }
 * })
 *
 * @summary
 *
 * Confirm an exchange request.
 */
export const confirmExchangeRequestWorkflow = createWorkflow(
  confirmExchangeRequestWorkflowId,
  function (
    input: ConfirmExchangeRequestWorkflowInput
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
        "id",
        "version",
        "canceled_at",
        "items.*",
        "items.item.id",
        "shipping_address.*",
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
        "actions.id",
        "actions.exchange_id",
        "actions.return_id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
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

    confirmExchangeRequestValidationStep({ order, orderExchange, orderChange })

    const { exchangeItems, returnItems } = transform(
      { orderChange },
      transformActionsToItems
    )

    const orderPreview = previewOrderChangeStep(order.id)

    const [createdExchangeItems, createdReturnItems] = parallelize(
      createOrderExchangeItemsFromActionsStep(exchangeItems),
      createReturnItemsFromActionsStep(returnItems)
    )

    confirmIfExchangeItemsArePresent({
      exchangeItems: createdExchangeItems,
      returnItems: createdReturnItems,
    })

    confirmOrderChanges({
      changes: [orderChange],
      orderId: order.id,
      confirmed_by: input.confirmed_by,
    })

    const returnId = transform(
      { createdReturnItems },
      ({ createdReturnItems }) => {
        return createdReturnItems?.[0]?.return_id
      }
    )

    when({ returnId }, ({ returnId }) => {
      return !!returnId
    }).then(() => {
      const updateReturnData = getUpdateReturnData({ returnId })
      updateReturnsStep(updateReturnData)
    })

    const { returnShippingMethod, exchangeShippingMethod } = transform(
      { orderPreview, orderExchange, returnId },
      extractShippingOption
    )

    when({ exchangeShippingMethod }, ({ exchangeShippingMethod }) => {
      return !!exchangeShippingMethod
    }).then(() => {
      const exchange: OrderExchangeDTO = useRemoteQueryStep({
        entry_point: "order_exchange",
        fields: [
          "id",
          "version",
          "canceled_at",
          "order.sales_channel_id",
          "additional_items.quantity",
          "additional_items.raw_quantity",
          "additional_items.item.id",
          "additional_items.item.variant.manage_inventory",
          "additional_items.item.variant.allow_backorder",
          "additional_items.item.variant.inventory_items.inventory_item_id",
          "additional_items.item.variant.inventory_items.required_quantity",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.id",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.name",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.sales_channels.id",
          "additional_items.item.variant.inventory_items.inventory.location_levels.stock_locations.sales_channels.name",
        ],
        variables: { id: input.exchange_id },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "exchange-query" })

      const { variants, items } = transform({ exchange }, ({ exchange }) => {
        const allItems: any[] = []
        const allVariants: any[] = []
        exchange.additional_items.forEach((exchangeItem) => {
          const item = exchangeItem.item
          allItems.push({
            id: item.id,
            variant_id: item.variant_id,
            quantity: exchangeItem.raw_quantity ?? exchangeItem.quantity,
          })
          allVariants.push(item.variant)
        })

        return {
          variants: allVariants,
          items: allItems,
        }
      })

      const formatedInventoryItems = transform(
        {
          input: {
            sales_channel_id: (exchange as any).order.sales_channel_id,
            variants,
            items,
          },
        },
        prepareConfirmInventoryInput
      )

      const createdReservations = reserveInventoryStep(formatedInventoryItems)

      const reservationCreatedEvents = transform(
        { createdReservations, order },
        ({ createdReservations, order }) => {
          return (createdReservations ?? []).map((reservation) => ({
            id: reservation.id,
            order_id: order.id,
          }))
        }
      )

      emitEventStep({
        eventName: ReservationItemWorkflowEvents.CREATED,
        data: reservationCreatedEvents,
      }).config({ name: "emit-reservation-item-created" })
    })

    when(
      { returnShippingMethod, returnId },
      ({ returnShippingMethod, returnId }) => {
        return !!returnShippingMethod && !!returnId
      }
    ).then(() => {
      const returnShippingOption = useRemoteQueryStep({
        entry_point: "shipping_options",
        fields: [
          "id",
          "provider_id",
          "service_zone.fulfillment_set.location.id",
          "service_zone.fulfillment_set.location.address.*",
        ],
        variables: {
          id: returnShippingMethod.shipping_option_id,
        },
        list: false,
      }).config({ name: "exchange-return-shipping-option" })

      const fulfillmentData = transform(
        {
          order,
          items: order.items!,
          shippingOption: returnShippingOption,
        },
        prepareFulfillmentData
      )

      const returnFulfillment =
        createReturnFulfillmentWorkflow.runAsStep(fulfillmentData)

      const returnLink = transform(
        { returnId, fulfillment: returnFulfillment },
        (data) => {
          return [
            {
              [Modules.ORDER]: { return_id: data.returnId },
              [Modules.FULFILLMENT]: { fulfillment_id: data.fulfillment.id },
            },
          ]
        }
      )

      createRemoteLinkStep(returnLink).config({
        name: "exchange-return-shipping-fulfillment-link",
      })
    })

    createOrUpdateOrderPaymentCollectionWorkflow.runAsStep({
      input: {
        order_id: order.id,
      },
    })

    emitEventStep({
      eventName: OrderWorkflowEvents.EXCHANGE_CREATED,
      data: {
        order_id: order.id,
        exchange_id: orderExchange.id,
      },
    })

    return new WorkflowResponse(orderPreview)
  }
)
