import {
  FulfillmentWorkflow,
  OrderChangeDTO,
  OrderDTO,
  ReturnDTO,
} from "@medusajs/types"
import {
  ChangeActionType,
  MedusaError,
  Modules,
  OrderChangeStatus,
} from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../../common"
import { createReturnFulfillmentWorkflow } from "../../../fulfillment/workflows/create-return-fulfillment"
import { previewOrderChangeStep } from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import { createReturnItemsStep } from "../../steps/create-return-items"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

type WorkflowInput = {
  return_id: string
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
  items,
  returnShippingOption,
}: {
  order: OrderDTO
  items: any[]
  returnShippingOption: {
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

  const locationId =
    returnShippingOption.service_zone.fulfillment_set.location?.id

  // delivery address is the stock location address
  const address =
    returnShippingOption.service_zone.fulfillment_set.location?.address ?? {}

  delete address.id

  if (!locationId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Cannot create return without stock location, either provide a location or you should link the shipping option ${returnShippingOption.id} to a stock location.`
    )
  }

  return {
    input: {
      location_id: locationId,
      provider_id: returnShippingOption.provider_id,
      shipping_option_id: returnShippingOption.id,
      items: fulfillmentItems,
      delivery_address: address,
      order: order,
    },
  }
}

export const confirmReturnRequestWorkflowId = "confirm-return-request"
export const confirmReturnRequestWorkflow = createWorkflow(
  confirmReturnRequestWorkflowId,
  function (input: WorkflowInput): WorkflowData<OrderDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "location_id", "canceled_at"],
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

    const createdReturnItems = createReturnItemsStep({
      returnId: orderReturn.id,
      changes: returnItemActions,
    })

    confirmOrderChanges({ changes: [orderChange], orderId: order.id })

    const returnModified = useRemoteQueryStep({
      entry_point: "return",
      fields: [
        "id",
        "status",
        "order_id",
        "canceled_at",
        "shipping_methods.shipping_option_id",
      ],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "return-query" })

    const returnShippingOptionId = transform(
      { returnModified },
      ({ returnModified }) => {
        if (!returnModified.shipping_methods?.length) {
          return
        }

        return returnModified.shipping_methods[0].shipping_option_id
      }
    )

    when({ returnShippingOptionId }, ({ returnShippingOptionId }) => {
      return !!returnShippingOptionId
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
          id: returnShippingOptionId,
        },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "return-shipping-option" })

      const fulfillmentData = transform(
        { order, items: createdReturnItems, returnShippingOption },
        prepareFulfillmentData
      )

      const returnFulfillment =
        createReturnFulfillmentWorkflow.runAsStep(fulfillmentData)

      const link = transform(
        { orderReturn, fulfillment: returnFulfillment },
        (data) => {
          return [
            {
              [Modules.ORDER]: { return_id: data.orderReturn.id },
              [Modules.FULFILLMENT]: { fulfillment_id: data.fulfillment.id },
            },
          ]
        }
      )

      createRemoteLinkStep(link)
    })

    return previewOrderChangeStep(order.id)
  }
)
