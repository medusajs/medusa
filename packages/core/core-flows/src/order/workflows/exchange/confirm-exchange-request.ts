import {
  FulfillmentWorkflow,
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
} from "@medusajs/types"
import { ChangeActionType, Modules, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../../common"
import { createFulfillmentWorkflow } from "../../../fulfillment/workflows/create-fulfillment"
import { createReturnFulfillmentWorkflow } from "../../../fulfillment/workflows/create-return-fulfillment"
import { previewOrderChangeStep } from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import { createOrderExchangeItemsFromActionsStep } from "../../steps/exchange/create-exchange-items-from-actions"
import { createReturnItemsFromActionsStep } from "../../steps/return/create-return-items-from-actions"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

type WorkflowInput = {
  exchange_id: string
}

const validationStep = createStep(
  "validate-confirm-exchange-request",
  async function ({
    order,
    orderChange,
    orderExchange,
  }: {
    order: OrderDTO
    orderExchange: OrderExchangeDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfOrderChangeIsNotActive({ orderChange })
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
    const orderItem = orderItemsMap.get(i.item_id)!
    return {
      line_item_id: i.item_id,
      quantity: i.quantity,
      return_quantity: i.quantity,
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

export const confirmExchangeRequestWorkflowId = "confirm-exchange-request"
export const confirmExchangeRequestWorkflow = createWorkflow(
  confirmExchangeRequestWorkflowId,
  function (input: WorkflowInput): WorkflowResponse<OrderDTO> {
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
        "items.id",
        "items.title",
        "items.variant_title",
        "items.variant_sku",
        "items.variant_barcode",
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

    validationStep({ order, orderExchange, orderChange })

    const { exchangeItems, returnItems } = transform(
      { orderChange },
      transformActionsToItems
    )

    const orderPreview = previewOrderChangeStep(order.id)

    const [createExchangeItems, createdReturnItems] = parallelize(
      createOrderExchangeItemsFromActionsStep(exchangeItems),
      createReturnItemsFromActionsStep(returnItems),
      confirmOrderChanges({ changes: [orderChange], orderId: order.id })
    )

    const returnId = transform(
      { createdReturnItems },
      ({ createdReturnItems }) => {
        return createdReturnItems?.[0]?.return_id
      }
    )

    const exchangeId = transform(
      { createExchangeItems },
      ({ createExchangeItems }) => {
        return createExchangeItems?.[0]?.exchange_id
      }
    )

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
          "additional_items.id",
          "additional_items.title",
          "additional_items.variant_title",
          "additional_items.variant_sku",
          "additional_items.variant_barcode",
        ],
        variables: { id: exchangeId },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "exchange-query" })

      const exchangeShippingOption = useRemoteQueryStep({
        entry_point: "shipping_options",
        fields: [
          "id",
          "provider_id",
          "service_zone.fulfillment_set.location.id",
          "service_zone.fulfillment_set.location.address.*",
        ],
        variables: {
          id: exchangeShippingMethod.shipping_option_id,
        },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "exchange-shipping-option" })

      const fulfillmentData = transform(
        {
          order,
          items: exchange.additional_items! ?? [],
          shippingOption: exchangeShippingOption,
          deliveryAddress: order.shipping_address,
        },
        prepareFulfillmentData
      )

      const fulfillment = createFulfillmentWorkflow.runAsStep(fulfillmentData)

      const link = transform({ fulfillment, order }, (data) => {
        return [
          {
            [Modules.ORDER]: { order_id: data.order.id },
            [Modules.FULFILLMENT]: { fulfillment_id: data.fulfillment.id },
          },
        ]
      })

      createRemoteLinkStep(link).config({
        name: "exchange-shipping-fulfillment-link",
      })
    })

    when({ returnShippingMethod }, ({ returnShippingMethod }) => {
      return !!returnShippingMethod
    }).then(() => {
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
        throw_if_key_not_found: true,
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

    return new WorkflowResponse(orderPreview)
  }
)
