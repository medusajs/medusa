import {
  OrderChangeDTO,
  OrderDTO,
  OrderReturnItemDTO,
  ReturnDTO,
} from "@medusajs/types"
import { ChangeActionType, Modules, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../../common"
import { createReturnFulfillmentStep } from "../../../fulfillment"
import { previewOrderChangeStep } from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import { createReturnItemsStep } from "../../steps/create-return-items"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

type WorkflowInput = {
  return_id: string
  location_id: string
}

const validationStep = createStep(
  "validate-confirm-return-request",
  async function ({
    order,
    orderChange,
    orderReturn,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

function prepareFulfillmentData({
  order,
  returnItems,
  locationId,
  returnShippingOption,
}: {
  order: OrderDTO
  returnItems: OrderReturnItemDTO[]
  locationId: string
  returnShippingOption: {
    id: string
    provider_id: string
  }
}) {
  const orderItemsMap = new Map<string, Required<OrderDTO>["items"][0]>(
    order.items!.map((i) => [i.id, i])
  )

  const fulfillmentItems = returnItems.map((i) => {
    const orderItem = orderItemsMap.get(i.item_id)!

    return {
      line_item_id: i.id,
      quantity: i.quantity,
      return_quantity: i.quantity,
      title: orderItem.variant_title ?? orderItem.title,
      sku: orderItem.variant_sku || "",
      barcode: orderItem.variant_barcode || "",
    }
  })

  return {
    location_id: locationId,
    provider_id: returnShippingOption.provider_id,
    shipping_option_id: returnShippingOption.id,
    items: fulfillmentItems,
    labels: [],
    // TODO: Where should we get the delivery address from?
    delivery_address: {},
    order: order,
  }
}

export const confirmReturnRequestWorkflowId = "confirm-return-request"
export const confirmReturnRequestWorkflow = createWorkflow(
  confirmReturnRequestWorkflowId,
  function (input: WorkflowInput): WorkflowData<OrderDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.return_id },
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
      ],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const returnShipping = useRemoteQueryStep({
      entry_point: "order_shipping_method",
      fields: ["id", "shipping_method.shipping_option_id"],
      variables: { return_id: orderReturn.id },
      list: false,
    }).config({ name: "return-shipping-query" })

    const returnShippingOption = useRemoteQueryStep({
      entry_point: "shipping_option",
      fields: ["id", "provider_id"],
      variables: { id: returnShipping.shipping_method.shipping_option_id },
      list: false,
    }).config({ name: "return-shipping-option-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "id",
        "actions.id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
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

    const returnItemActions = transform({ orderChange }, (data) => {
      return data.orderChange.actions.filter(
        (act) => act.action === ChangeActionType.RETURN_ITEM
      )
    })

    validationStep({ order, orderReturn, orderChange })

    const returnItems = createReturnItemsStep({
      returnId: orderReturn.id,
      changes: returnItemActions,
    })

    const fulfillmentData = transform(
      {
        order,
        returnItems,
        returnShipping,
        locationId: input.location_id!,
        returnShippingOption,
      },
      prepareFulfillmentData
    )

    const fulfillment = createReturnFulfillmentStep(fulfillmentData)

    const link = transform(
      { order_id: order.id, fulfillment: fulfillment },
      (data) => {
        return [
          {
            [Modules.ORDER]: { order_id: data.order_id },
            [Modules.FULFILLMENT]: { fulfillment_id: data.fulfillment.id },
          },
        ]
      }
    )

    createRemoteLinkStep(link)

    confirmOrderChanges({ changes: [orderChange], orderId: order.id })

    return previewOrderChangeStep(order.id)
  }
)
