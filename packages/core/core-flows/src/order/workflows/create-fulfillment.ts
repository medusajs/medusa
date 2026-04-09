import {
  AdditionalData,
  BigNumberInput,
  FulfillmentWorkflow,
  InventoryItemDTO,
  OrderDTO,
  OrderLineItemDTO,
  OrderWorkflow,
  ProductDTO,
  ProductVariantDTO,
  ReservationItemDTO,
  ShippingProfileDTO,
} from "@medusajs/framework/types"
import {
  MathBN,
  MedusaError,
  Modules,
  OrderWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createRemoteLinkStep,
  emitEventStep,
  useQueryGraphStep,
  useRemoteQueryStep,
} from "../../common"
import { createFulfillmentWorkflow } from "../../fulfillment"
import { adjustInventoryLevelsStep } from "../../inventory"
import {
  deleteReservationsStep,
  updateReservationsStep,
} from "../../reservation"
import { registerOrderFulfillmentStep } from "../steps"
import { buildReservationsMap } from "../utils/build-reservations-map"
import {
  throwIfItemsAreNotGroupedByShippingRequirement,
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderIsCancelled,
} from "../utils/order-validation"

type OrderItemWithVariantDTO = OrderLineItemDTO & {
  variant?: ProductVariantDTO & {
    product?: ProductDTO & {
      shipping_profile?: ShippingProfileDTO
    }
    inventory_items: {
      inventory: InventoryItemDTO
      variant_id: string
      inventory_item_id: string
      required_quantity: number
    }[]
  }
}

/**
 * The data to validate the order fulfillment creation.
 */
export type CreateFulfillmentValidateOrderStepInput = {
  /**
   * The order to create the fulfillment for.
   */
  order: OrderDTO
  /**
   * The items to fulfill.
   */
  inputItems: OrderWorkflow.CreateOrderFulfillmentWorkflowInput["items"]
}

/**
 * This step validates that a fulfillment can be created for an order. If the order
 * is canceled, the items don't exist in the order, or the items aren't grouped by
 * shipping requirement, the step throws an error.
 *
 * :::note
 *
 * You can retrieve an order's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = createFulfillmentValidateOrder({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   inputItems: [
 *     {
 *       id: "orli_123",
 *       quantity: 1,
 *     }
 *   ]
 * })
 */
export const createFulfillmentValidateOrder = createStep(
  "create-fulfillment-validate-order",
  ({ order, inputItems }: CreateFulfillmentValidateOrderStepInput) => {
    if (!inputItems.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No items to fulfill"
      )
    }

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
    shipping_profile_id: string
  }
  shippingMethod: { data?: Record<string, unknown> | null }
  reservations: ReservationItemDTO[]
  itemsList?: OrderLineItemDTO[]
}) {
  const fulfillableItems = input.items
  const orderItemsMap = new Map<string, Required<OrderDTO>["items"][0]>(
    (itemsList ?? order.items)!.map((i) => [i.id, i])
  )

  const reservationItemMap = buildReservationsMap(reservations)

  // Note: If any of the items require shipping, we enable fulfillment
  // unless explicitly set to not require shipping by the item in the request
  const someItemsRequireShipping = fulfillableItems.length
    ? fulfillableItems.some((item) => {
        const orderItem = orderItemsMap.get(item.id)!

        return orderItem.requires_shipping
      })
    : true

  const fulfillmentItems = fulfillableItems
    .map((i) => {
      const orderItem = orderItemsMap.get(i.id)! as OrderItemWithVariantDTO
      const reservations = reservationItemMap.get(i.id)

      if (
        orderItem.requires_shipping &&
        orderItem.variant?.product &&
        orderItem.variant?.product.shipping_profile?.id !==
          shippingOption.shipping_profile_id
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Shipping profile ${shippingOption.shipping_profile_id} does not match the shipping profile of the order item ${orderItem.id}`
        )
      }

      if (!reservations?.length) {
        return [
          {
            line_item_id: i.id,
            inventory_item_id: undefined,
            quantity: i.quantity,
            title: orderItem.variant_title ?? orderItem.title,
            sku: orderItem.variant_sku || "",
            barcode: orderItem.variant_barcode || "",
          },
        ] as FulfillmentWorkflow.CreateFulfillmentItemWorkflowDTO[]
      }

      // if line item is from a managed variant, create a fulfillment item for each reservation item
      return reservations.map((r) => {
        const iItem = orderItem?.variant?.inventory_items.find(
          (ii) => ii.inventory.id === r.inventory_item_id
        )

        return {
          line_item_id: i.id,
          inventory_item_id: r.inventory_item_id,
          quantity: MathBN.mult(
            iItem?.required_quantity ?? 1,
            i.quantity
          ) as BigNumberInput,
          title:
            iItem?.inventory.title ||
            orderItem.variant_title ||
            orderItem.title,
          sku: iItem?.inventory.sku || orderItem.variant_sku || "",
          barcode: orderItem.variant_barcode || "",
        } as FulfillmentWorkflow.CreateFulfillmentItemWorkflowDTO
      })
    })
    .flat()

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
      created_by: input.created_by,
      packed_at: new Date(),
      metadata: input.metadata,
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

  const orderItemsMap = new Map<string, Required<OrderDTO>["items"][0]>(
    (itemsList ?? order.items)!.map((i) => [i.id, i])
  )

  const reservationMap = buildReservationsMap(reservations)

  const allItems = itemsList ?? order.items
  const itemsToFulfill = allItems.filter((i) => i.id in inputItemsMap)

  // iterate over items that are being fulfilled
  for (const item of itemsToFulfill) {
    const reservations = reservationMap.get(item.id)
    const orderItem = orderItemsMap.get(item.id)! as OrderItemWithVariantDTO

    if (!reservations?.length) {
      if (item.variant?.manage_inventory) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `No stock reservation found for item ${item.id} - ${item.title} (${item.variant_title})`
        )
      }
      continue
    }

    const inputQuantity = inputItemsMap[item.id]?.quantity ?? item.quantity

    reservations.forEach((reservation) => {
      const iItem = orderItem?.variant?.inventory_items.find(
        (ii) => ii.inventory.id === reservation.inventory_item_id
      )

      const adjustemntQuantity = MathBN.mult(
        inputQuantity,
        iItem?.required_quantity ?? 1
      )

      const remainingReservationQuantity = MathBN.sub(
        reservation.quantity,
        adjustemntQuantity
      )

      if (MathBN.lt(remainingReservationQuantity, 0)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Quantity to fulfill exceeds the reserved quantity for the item: ${item.id}`
        )
      }

      inventoryAdjustment.push({
        inventory_item_id: reservation.inventory_item_id,
        location_id: input.location_id ?? reservation.location_id,
        adjustment: MathBN.mult(adjustemntQuantity, -1),
      })

      if (MathBN.eq(remainingReservationQuantity, 0)) {
        toDelete.push(reservation.id)
      } else {
        toUpdate.push({
          id: reservation.id,
          quantity: remainingReservationQuantity,
          location_id: input.location_id ?? reservation.location_id,
        })
      }
    })
  }
  return {
    toDelete,
    toUpdate,
    inventoryAdjustment,
  }
}

/**
 * The details of the fulfillment to create, along with custom data that's passed to the workflow's hooks.
 */
export type CreateOrderFulfillmentWorkflowInput =
  OrderWorkflow.CreateOrderFulfillmentWorkflowInput & AdditionalData

export const createOrderFulfillmentWorkflowId = "create-order-fulfillment"
/**
 * This workflow creates a fulfillment for an order. It's used by the [Create Order Fulfillment Admin API Route](https://docs.medusajs.com/api/admin#orders_postordersidfulfillments).
 *
 * This workflow has a hook that allows you to perform custom actions on the created fulfillment. For example, you can pass under `additional_data` custom data that
 * allows you to create custom data models linked to the fulfillment.
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around creating a fulfillment.
 *
 * @example
 * const { result } = await createOrderFulfillmentWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         quantity: 1,
 *       }
 *     ],
 *     additional_data: {
 *       send_oms: true
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Creates a fulfillment for an order.
 *
 * @property hooks.fulfillmentCreated - This hook is executed after the fulfillment is created. You can consume this hook to perform custom actions on the created fulfillment.
 */
export const createOrderFulfillmentWorkflow = createWorkflow(
  createOrderFulfillmentWorkflowId,
  (input: WorkflowData<CreateOrderFulfillmentWorkflowInput>) => {
    const { data: order } = useQueryGraphStep({
      entity: "order",
      filters: { id: input.order_id },
      fields: [
        "id",
        "display_id",
        "custom_display_id",
        "status",
        "customer_id",
        "customer.*",
        "sales_channel_id",
        "sales_channel.*",
        "region_id",
        "region.*",
        "currency_code",
        "items.*",
        "items.variant.manage_inventory",
        "items.variant.allow_backorder",
        "items.variant.product.id",
        "items.variant.product.shipping_profile.id",
        "items.variant.weight",
        "items.variant.length",
        "items.variant.height",
        "items.variant.width",
        "items.variant.material",
        "items.variant_title",
        "items.variant.upc",
        "items.variant.sku",
        "items.variant.barcode",
        "items.variant.hs_code",
        "items.variant.origin_country",
        "items.variant.product.origin_country",
        "items.variant.product.hs_code",
        "items.variant.product.mid_code",
        "items.variant.product.material",
        "items.tax_lines.rate",
        "metadata",
        "subtotal",
        "discount_total",
        "tax_total",
        "item_total",
        "shipping_total",
        "total",
        "created_at",
        "items.variant.inventory_items.required_quantity",
        "items.variant.inventory_items.inventory.id",
        "items.variant.inventory_items.inventory.title",
        "items.variant.inventory_items.inventory.sku",
        "shipping_address.*",
        "shipping_methods.id",
        "shipping_methods.shipping_option_id",
        "shipping_methods.data",
        "shipping_methods.amount",
      ],
      options: { throwIfKeyNotFound: true, isList: false },
    }).config({ name: "get-order" })

    createFulfillmentValidateOrder({ order, inputItems: input.items })

    const inputItemsMap = transform(input, ({ items }) => {
      return items.reduce((acc, item) => {
        acc[item.id] = item
        return acc
      }, {})
    })

    const shippingOptionId = transform({ order, input }, (data) => {
      return (
        data.input.shipping_option_id ??
        data.order.shipping_methods?.[0]?.shipping_option_id
      )
    })

    const shippingMethod = transform({ order, shippingOptionId }, (data) => {
      return {
        data: data.order.shipping_methods?.find(
          (sm) => sm.shipping_option_id === data.shippingOptionId
        )?.data,
      }
    })

    const shippingOption = useRemoteQueryStep({
      entry_point: "shipping_options",
      fields: [
        "id",
        "provider_id",
        "service_zone.fulfillment_set.location.id",
        "shipping_profile_id",
      ],
      variables: {
        id: shippingOptionId,
      },
      list: false,
    }).config({ name: "get-shipping-option" })

    const lineItemIds = transform(
      { order, itemsList: input.items_list, inputItemsMap },
      ({ order, itemsList, inputItemsMap }) => {
        return (itemsList ?? order.items)!
          .map((i) => i.id)
          .filter((i) => i in inputItemsMap)
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
          no_notification: input.no_notification,
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
