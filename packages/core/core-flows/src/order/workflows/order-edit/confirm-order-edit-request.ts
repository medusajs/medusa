import {
  FulfillmentWorkflow,
  OrderChangeDTO,
  OrderDTO,
  OrderOrderEditDTO,
} from "@medusajs/types"
import { Modules, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../../common"
import { reserveInventoryStep } from "../../../definition/cart/steps/reserve-inventory"
import { prepareConfirmInventoryInput } from "../../../definition/cart/utils/prepare-confirm-inventory-input"
import { createReturnFulfillmentWorkflow } from "../../../fulfillment/workflows/create-return-fulfillment"
import { previewOrderChangeStep } from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

export type ConfirmOrderEditRequestWorkflowInput = {
  order_id: string
}

/**
 * This step validates that a requested order edit can be confirmed.
 */
export const confirmOrderEditRequestValidationStep = createStep(
  "validate-confirm-order-edit-request",
  async function ({
    order,
    orderChange,
    orderOrderEdit,
  }: {
    order: OrderDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

function prepareFulfillmentData({
  order,
  items,
  shippingOption,
  deliveryAddress,
  isReturn,
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
  isReturn?: boolean
}) {
  const orderItemsMap = new Map<string, Required<OrderDTO>["items"][0]>(
    order.items!.map((i) => [i.id, i])
  )
  const fulfillmentItems = items.map((i) => {
    const orderItem = orderItemsMap.get(i.item_id) ?? i.item
    return {
      line_item_id: i.item_id,
      quantity: !isReturn ? i.quantity : undefined,
      return_quantity: isReturn ? i.quantity : undefined,
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

export const confirmOrderEditRequestWorkflowId = "confirm-order-edit-request"
/**
 * This workflow confirms an order edit request.
 */
export const confirmOrderEditRequestWorkflow = createWorkflow(
  confirmOrderEditRequestWorkflowId,
  function (
    input: ConfirmOrderEditRequestWorkflowInput
  ): WorkflowResponse<OrderDTO> {
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
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "id",
        "actions.id",
        "actions.order_id",
        "actions.return_id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
      ],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    confirmOrderEditRequestValidationStep({
      order,
      orderChange,
    })

    const orderPreview = previewOrderChangeStep(order.id)

    confirmOrderChanges({ changes: [orderChange], orderId: order.id })

    const { orderEditShippingMethod } = transform(
      { orderPreview },
      extractShippingOption
    )

    when({ orderEditShippingMethod }, ({ orderEditShippingMethod }) => {
      return !!orderEditShippingMethod
    }).then(() => {
      const orderEdit: OrderOrderEditDTO = useRemoteQueryStep({
        entry_point: "order",
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
        variables: { id: orderEditShippingMethod },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "order-query" })

      const { variants, items } = transform({ orderEdit }, ({ orderEdit }) => {
        const allItems: any[] = []
        const allVariants: any[] = []
        orderEdit.additional_items.forEach((orderEditItem) => {
          const item = orderEditItem.item
          allItems.push({
            id: item.id,
            variant_id: item.variant_id,
            quantity: orderEditItem.raw_quantity ?? orderEditItem.quantity,
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
            sales_channel_id: (orderEdit as any).order.sales_channel_id,
            variants,
            items,
          },
        },
        prepareConfirmInventoryInput
      )

      reserveInventoryStep(formatedInventoryItems)
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
      }).config({ name: "orderEdit-return-shipping-option" })

      const fulfillmentData = transform(
        {
          order,
          items: order.items!,
          shippingOption: returnShippingOption,
          isReturn: true,
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
        name: "orderEdit-return-shipping-fulfillment-link",
      })
    })

    return new WorkflowResponse(orderPreview)
  }
)
