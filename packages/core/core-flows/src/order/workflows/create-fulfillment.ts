import {
  FulfillmentDTO,
  FulfillmentWorkflow,
  OrderDTO,
  OrderWorkflow,
  ReservationItemDTO,
} from "@medusajs/types"
import { MedusaError, Modules } from "@medusajs/utils"
import {
  createStep,
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../common"
import { createFulfillmentWorkflow } from "../../fulfillment"
import { adjustInventoryLevelsStep } from "../../inventory"
import {
  deleteReservationsStep,
  updateReservationsStep,
} from "../../reservation"
import { registerOrderFulfillmentStep } from "../steps"
import {
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderIsCancelled,
} from "../utils/order-validation"

const validateOrder = createStep(
  "validate-order",
  (
    {
      order,
      inputItems,
    }: {
      order: OrderDTO
      inputItems: OrderWorkflow.CreateOrderFulfillmentWorkflowInput["items"]
    },
    context
  ) => {
    throwIfOrderIsCancelled({ order })
    throwIfItemsDoesNotExistsInOrder({ order, inputItems })
  }
)

function prepareRegisterOrderFulfillmentData({
  order,
  fulfillment,
  input,
}: {
  order: OrderDTO
  fulfillment: FulfillmentDTO
  input: OrderWorkflow.CreateOrderFulfillmentWorkflowInput
}) {
  return {
    order_id: order.id,
    reference: Modules.FULFILLMENT,
    reference_id: fulfillment.id,
    created_by: input.created_by,
    items: order.items!.map((i) => {
      return {
        id: i.id,
        quantity: i.quantity,
      }
    }),
  }
}

function prepareFulfillmentData({
  order,
  input,
  shippingOption,
  reservations,
}: {
  order: OrderDTO
  input: OrderWorkflow.CreateOrderFulfillmentWorkflowInput
  shippingOption: {
    id: string
    provider_id: string
    service_zone: { fulfillment_set: { location?: { id: string } } }
  }
  reservations: ReservationItemDTO[]
}) {
  const inputItems = input.items
  const orderItemsMap = new Map<string, Required<OrderDTO>["items"][0]>(
    order.items!.map((i) => [i.id, i])
  )
  const reservationItemMap = new Map<string, ReservationItemDTO>(
    reservations.map((r) => [r.line_item_id as string, r])
  )
  const fulfillmentItems = inputItems.map((i) => {
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
      items: fulfillmentItems,
      labels: [] as FulfillmentWorkflow.CreateFulfillmentLabelWorkflowDTO[], // TODO: shipping labels
      delivery_address: shippingAddress as any,
    },
  }
}

function prepareInventoryUpdate({ reservations, order, input }) {
  const reservationMap = reservations.reduce((acc, reservation) => {
    acc[reservation.line_item_id as string] = reservation
    return acc
  }, {})

  const inputItemsMap = input.items.reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {})

  const toDelete: string[] = []
  const toUpdate: {
    id: string
    quantity: number // TODO: BigNumberInput
    location_id: string
  }[] = []
  const inventoryAdjustment: {
    inventory_item_id: string
    location_id: string
    adjustment: number // TODO: BigNumberInput
  }[] = []

  for (const item of order.items) {
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

    const quantity = reservation.quantity - inputQuantity

    inventoryAdjustment.push({
      inventory_item_id: reservation.inventory_item_id,
      location_id: input.location_id ?? reservation.location_id,
      adjustment: -item.quantity, // TODO: MathBN.mul(-1, item.quantity)
    })

    if (quantity === 0) {
      toDelete.push(reservation.id)
    } else {
      toUpdate.push({
        id: reservation.id,
        quantity: quantity,
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
export const createOrderFulfillmentWorkflow = createWorkflow(
  createOrderFulfillmentWorkflowId,
  (
    input: WorkflowData<OrderWorkflow.CreateOrderFulfillmentWorkflowInput>
  ): WorkflowData<FulfillmentDTO> => {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: [
        "id",
        "status",
        "region_id",
        "currency_code",
        "items.*",
        "items.variant.manage_inventory",
        "shipping_address.*",
        "shipping_methods.shipping_option_id", // TODO: which shipping method to use when multiple?
      ],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    validateOrder({ order, inputItems: input.items })

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

    const lineItemIds = transform({ order }, ({ order }) => {
      return order.items?.map((i) => i.id)
    })
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
      { order, input, shippingOption, reservations },
      prepareFulfillmentData
    )

    const fulfillment = createFulfillmentWorkflow.runAsStep(fulfillmentData)

    const registerOrderFulfillmentData = transform(
      { order, fulfillment, input },
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
      { order, reservations, input },
      prepareInventoryUpdate
    )

    parallelize(
      registerOrderFulfillmentStep(registerOrderFulfillmentData),
      createRemoteLinkStep(link),
      updateReservationsStep(toUpdate),
      deleteReservationsStep(toDelete),
      adjustInventoryLevelsStep(inventoryAdjustment)
    )

    // trigger event OrderModuleService.Events.FULFILLMENT_CREATED
    return fulfillment
  }
)
