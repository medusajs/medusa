import {
  AdditionalData,
  BigNumberInput,
  FulfillmentWorkflow,
  OrderDTO,
  OrderLineItemDTO,
  OrderWorkflow,
  ReservationItemDTO,
} from "@medusajs/framework/types"
import {
  MathBN,
  MedusaError,
  Modules,
  OrderWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  createRemoteLinkStep,
  emitEventStep,
  useRemoteQueryStep,
} from "../../common"
import { createFulfillmentWorkflow } from "../../fulfillment"
import { adjustInventoryLevelsStep } from "../../inventory"
import {
  deleteReservationsStep,
  updateReservationsStep,
} from "../../reservation"
import { registerOrderFulfillmentStep } from "../steps"
import {
  throwIfItemsAreNotGroupedByShippingRequirement,
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderIsCancelled,
} from "../utils/order-validation"

/**
 * This step validates that a fulfillment can be created for an order.
 */
export const createFulfillmentValidateOrder = createStep(
  "create-fulfillment-validate-order",
  ({
    order,
    inputItems,
  }: {
    order: OrderDTO
    inputItems: OrderWorkflow.CreateOrderFulfillmentWorkflowInput["items"]
  }) => {
    throwIfOrderIsCancelled({ order })
    throwIfItemsDoesNotExistsInOrder({ order, inputItems })
    throwIfItemsAreNotGroupedByShippingRequirement({ order, inputItems })
  }
)

function prepareRegisterOrderFulfillmentData({
  order,
  fulfillment,
  input,
  inputItemsMap,
  itemsList,
}) {
  return {
    order_id: order.id,
    reference: Modules.FULFILLMENT,
    reference_id: fulfillment.id,
    created_by: input.created_by,
    items: (itemsList ?? order.items)!.map((i) => {
      const inputQuantity = inputItemsMap[i.id]?.quantity
      return {
        id: i.id,
        quantity: inputQuantity ?? i.quantity,
      }
    }),
  }
}

function prepareFulfillmentData({
  order,
  input,
  shippingOption,
  shippingMethod,
  reservations,
  itemsList,
}: {
  order: OrderDTO
  input: OrderWorkflow.CreateOrderFulfillmentWorkflowInput
  shippingOption: {
    id: string
    provider_id: string
    service_zone: { fulfillment_set: { location?: { id: string } } }
  }
  shippingMethod: { data?: Record<string, unknown> | null }
  reservations: ReservationItemDTO[]
  itemsList?: OrderLineItemDTO[]
}) {
  const fulfillableItems = input.items
  const orderItemsMap = new Map<string, Required<OrderDTO>["items"][0]>(
    (itemsList ?? order.items)!.map((i) => [i.id, i])
  )

  const reservationItemMap = new Map<string, ReservationItemDTO>(
    reservations.map((r) => [r.line_item_id as string, r])
  )

  // Note: If any of the items require shipping, we enable fulfillment
  // unless explicitly set to not require shipping by the item in the request
  const someItemsRequireShipping = fulfillableItems.length
    ? fulfillableItems.some((item) => {
        const orderItem = orderItemsMap.get(item.id)!

        return orderItem.requires_shipping
      })
    : true

  const fulfillmentItems = fulfillableItems.map((i) => {
    const orderItem = orderItemsMap.get(i.id)!
    const reservation = reservationItemMap.get(i.id)!

    return {
      line_item_id: i.id,
      inventory_item_id: reservation?.inventory_item_id,
      quantity: i.quantity,
      title: orderItem.variant_title ?? orderItem.title,
      sku: orderItem.variant_sku || "",
      barcode: orderItem.variant_barcode || "",
    } as FulfillmentWorkflow.CreateFulfillmentItemWorkflowDTO
  })

  let locationId: string | undefined | null = input.location_id

  if (!locationId) {
    locationId = shippingOption.service_zone.fulfillment_set.location?.id
  }

  if (!locationId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Cannot create fulfillment without stock location, either provide a location or you should link the shipping option ${shippingOption.id} to a stock location.`
    )
  }

  const shippingAddress = order.shipping_address ?? { id: undefined }
  delete shippingAddress.id

  return {
    input: {
      location_id: locationId,
      provider_id: shippingOption.provider_id,
      shipping_option_id: shippingOption.id,
      order: order,
      data: shippingMethod.data,
      items: fulfillmentItems,
      requires_shipping: someItemsRequireShipping,
      labels: input.labels ?? [],
      delivery_address: shippingAddress as any,
      packed_at: new Date(),
    },
  }
}

function prepareInventoryUpdate({
  reservations,
  order,
  input,
  inputItemsMap,
  itemsList,
}) {
  const reservationMap = reservations.reduce((acc, reservation) => {
    acc[reservation.line_item_id as string] = reservation
    return acc
  }, {})

  const toDelete: string[] = []
  const toUpdate: {
    id: string
    quantity: BigNumberInput
    location_id: string
  }[] = []
  const inventoryAdjustment: {
    inventory_item_id: string
    location_id: string
    adjustment: BigNumberInput
  }[] = []

  const allItems = itemsList ?? order.items
  for (const item of allItems) {
    const reservation = reservationMap[item.id]
    if (!reservation) {
      if (item.manage_inventory) {
        throw new Error(
          `No stock reservation found for item ${item.id} - ${item.title} (${item.variant_title})`
        )
      }
      continue
    }

    const inputQuantity = inputItemsMap[item.id]?.quantity ?? item.quantity

    const remainingReservationQuantity = reservation.quantity - inputQuantity

    inventoryAdjustment.push({
      inventory_item_id: reservation.inventory_item_id,
      location_id: input.location_id ?? reservation.location_id,
      adjustment: MathBN.mult(inputQuantity, -1),
    })

    if (remainingReservationQuantity === 0) {
      toDelete.push(reservation.id)
    } else {
      toUpdate.push({
        id: reservation.id,
        quantity: remainingReservationQuantity,
        location_id: input.location_id ?? reservation.location_id,
      })
    }
  }

  return {
    toDelete,
    toUpdate,
    inventoryAdjustment,
  }
}

export const createOrderFulfillmentWorkflowId = "create-order-fulfillment"
/**
 * This creates a fulfillment for an order.
 */
export const createOrderFulfillmentWorkflow = createWorkflow(
  createOrderFulfillmentWorkflowId,
  (
    input: WorkflowData<
      OrderWorkflow.CreateOrderFulfillmentWorkflowInput & AdditionalData
    >
  ) => {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: [
        "id",
        "status",
        "region_id",
        "currency_code",
        "items.*",
        "items.variant.manage_inventory",
        "items.variant.allow_backorder",
        "shipping_address.*",
        "shipping_methods.shipping_option_id",
        "shipping_methods.data",
      ],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    createFulfillmentValidateOrder({ order, inputItems: input.items })

    const inputItemsMap = transform(input, ({ items }) => {
      return items.reduce((acc, item) => {
        acc[item.id] = item
        return acc
      }, {})
    })

    const shippingMethod = transform(order, (data) => {
      return { data: data.shipping_methods?.[0]?.data }
    })

    const shippingOptionId = transform(order, (data) => {
      return data.shipping_methods?.[0]?.shipping_option_id
    })

    const shippingOption = useRemoteQueryStep({
      entry_point: "shipping_options",
      fields: ["id", "provider_id", "service_zone.fulfillment_set.location.id"],
      variables: {
        id: shippingOptionId,
      },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "get-shipping-option" })

    const lineItemIds = transform(
      { order, itemsList: input.items_list },
      ({ order, itemsList }) => {
        return (itemsList ?? order.items)!.map((i) => i.id)
      }
    )
    const reservations = useRemoteQueryStep({
      entry_point: "reservations",
      fields: [
        "id",
        "line_item_id",
        "quantity",
        "inventory_item_id",
        "location_id",
      ],
      variables: {
        filter: {
          line_item_id: lineItemIds,
        },
      },
    }).config({ name: "get-reservations" })

    const fulfillmentData = transform(
      {
        order,
        input,
        shippingOption,
        shippingMethod,
        reservations,
        itemsList: input.items_list,
      },
      prepareFulfillmentData
    )

    const fulfillment = createFulfillmentWorkflow.runAsStep(fulfillmentData)

    const registerOrderFulfillmentData = transform(
      {
        order,
        fulfillment,
        input,
        inputItemsMap,
        itemsList: input.items ?? input.items_list,
      },
      prepareRegisterOrderFulfillmentData
    )

    const link = transform(
      { order_id: input.order_id, fulfillment },
      (data) => {
        return [
          {
            [Modules.ORDER]: { order_id: data.order_id },
            [Modules.FULFILLMENT]: { fulfillment_id: data.fulfillment.id },
          },
        ]
      }
    )

    const { toDelete, toUpdate, inventoryAdjustment } = transform(
      {
        order,
        reservations,
        input,
        inputItemsMap,
        itemsList: input.items_list,
      },
      prepareInventoryUpdate
    )

    adjustInventoryLevelsStep(inventoryAdjustment)
    parallelize(
      registerOrderFulfillmentStep(registerOrderFulfillmentData),
      createRemoteLinkStep(link),
      updateReservationsStep(toUpdate),
      deleteReservationsStep(toDelete),
      emitEventStep({
        eventName: OrderWorkflowEvents.FULFILLMENT_CREATED,
        data: {
          order_id: input.order_id,
          fulfillment_id: fulfillment.id,
        },
      })
    )

    const fulfillmentCreated = createHook("fulfillmentCreated", {
      fulfillment,
      additional_data: input.additional_data,
    })

    // trigger event OrderModuleService.Events.FULFILLMENT_CREATED
    return new WorkflowResponse(fulfillment, {
      hooks: [fulfillmentCreated],
    })
  }
)
