import {
  BigNumberInput,
  FulfillmentDTO,
  InventoryItemDTO,
  OrderDTO,
  OrderLineItemDTO,
  ProductVariantDTO,
  RegisterOrderDeliveryDTO,
} from "@medusajs/framework/types"
import {
  FulfillmentWorkflowEvents,
  MathBN,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useQueryGraphStep } from "../../common"
import { markFulfillmentAsDeliveredWorkflow } from "../../fulfillment"
import { registerOrderDeliveryStep } from "../steps/register-delivery"
import {
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderIsCancelled,
} from "../utils/order-validation"
import { acquireLockStep, releaseLockStep } from "../../locking"

type OrderItemWithVariantDTO = OrderLineItemDTO & {
  variant?: ProductVariantDTO & {
    inventory_items: {
      inventory: InventoryItemDTO
      variant_id: string
      inventory_item_id: string
      required_quantity: number
    }[]
  }
}

/**
 * The data to validate the order fulfillment deliverability.
 */
export type OrderFulfillmentDeliverabilityValidationStepInput = {
  /**
   * The order to validate the fulfillment deliverability for.
   */
  order: OrderDTO & {
    /**
     * The fulfillments in the order.
     */
    fulfillments: FulfillmentDTO[]
  }
  /**
   * The fulfillment to validate the deliverability for.
   */
  fulfillment: FulfillmentDTO
}

export const orderFulfillmentDeliverablilityValidationStepId =
  "order-fulfillment-deliverability-validation"
/**
 * This step validates that the order fulfillment can be delivered. If the order is cancelled,
 * the items to mark as delivered don't exist in the order, or the fulfillment doesn't exist in the order,
 * the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order and fulfillment's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = orderFulfillmentDeliverablilityValidationStep({
 *   order: {
 *     id: "order_123",
 *     fulfillments: [
 *       {
 *         id: "ful_123",
 *         // other fulfillment details...
 *       }
 *     ]
 *     // other order details...
 *   },
 *   fulfillment: {
 *     id: "ful_123",
 *     // other fulfillment details...
 *   }
 * })
 */
export const orderFulfillmentDeliverablilityValidationStep = createStep(
  orderFulfillmentDeliverablilityValidationStepId,
  async ({
    fulfillment,
    order,
  }: {
    order: OrderDTO & { fulfillments: FulfillmentDTO[] }
    fulfillment: FulfillmentDTO
  }) => {
    throwIfOrderIsCancelled({ order })

    const orderFulfillment = order.fulfillments?.find(
      (f) => f.id === fulfillment.id
    )

    if (!orderFulfillment) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Fulfillment with id ${fulfillment.id} not found in the order`
      )
    }

    throwIfItemsDoesNotExistsInOrder({
      order,
      inputItems: order.items!.map((i) => ({
        id: i.id,
        quantity: i.quantity,
      })),
    })
  }
)

function prepareRegisterDeliveryData({
  fulfillment,
  order,
}: {
  fulfillment: FulfillmentDTO
  order: OrderDTO & { fulfillments: FulfillmentDTO[] }
}): RegisterOrderDeliveryDTO {
  const orderFulfillment = order.fulfillments.find(
    (f) => f.id === fulfillment.id
  )!

  const lineItemIds = new Array(
    ...new Set(orderFulfillment.items.map((i) => i.line_item_id))
  )

  return {
    order_id: order.id,
    reference: Modules.FULFILLMENT,
    reference_id: orderFulfillment.id,
    items: lineItemIds!.map((lineItemId) => {
      // find order item
      const orderItem = order.items!.find(
        (i) => i.id === lineItemId
      ) as OrderItemWithVariantDTO
      // find inventory items
      const iitems = orderItem!.variant?.inventory_items
      // find fulfillment item
      const fitem = orderFulfillment.items.find(
        (i) => i.line_item_id === lineItemId
      )!

      let quantity: BigNumberInput = fitem.quantity

      // NOTE: if the order item has an inventory kit or `required_qunatity` > 1, fulfillment items wont't match 1:1 with order items.
      // - for each inventory item in the kit, a fulfillment item will be created i.e. one line item could have multiple fulfillment items
      // - the quantity of the fulfillment item will be the quantity of the order item multiplied by the required quantity of the inventory item
      //
      //   We need to take this into account when marking the fulfillment as delivered to compute quantity of line items being delivered based on fulfillment items and qunatities.
      //   NOTE: for now we only need to find one inventory item of a line item to compute this since when a fulfillment is created all inventory items are fulfilled together.
      //   If we allow to cancel partial fulfillments for an order item, we need to change this.
      //

      if (iitems?.length) {
        const iitem = iitems.find(
          (i) => i.inventory.id === fitem.inventory_item_id
        )
        if(iitem)
          quantity = MathBN.div(quantity, iitem.required_quantity)
      }

      return {
        id: lineItemId as string,
        quantity,
      }
    }),
  }
}

/**
 * The details to mark a fulfillment in an order as delivered.
 */
export type MarkOrderFulfillmentAsDeliveredWorkflowInput = {
  /**
   * The ID of the order to mark the fulfillment as delivered in.
   */
  orderId: string
  /**
   * The ID of the fulfillment to mark as delivered.
   */
  fulfillmentId: string
}

export const markOrderFulfillmentAsDeliveredWorkflowId =
  "mark-order-fulfillment-as-delivered-workflow"
/**
 * This workflow marks a fulfillment in an order as delivered. It's used by the
 * [Mark Fulfillment as Delivered Admin API Route](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idmarkasdelivered).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * marking a fulfillment as delivered.
 *
 * @example
 * const { result } = await markOrderFulfillmentAsDeliveredWorkflow(container)
 * .run({
 *   input: {
 *     orderId: "order_123",
 *     fulfillmentId: "ful_123",
 *   }
 * })
 *
 * @summary
 *
 * Mark a fulfillment in an order as delivered.
 */
export const markOrderFulfillmentAsDeliveredWorkflow = createWorkflow(
  markOrderFulfillmentAsDeliveredWorkflowId,
  (input: WorkflowData<MarkOrderFulfillmentAsDeliveredWorkflowInput>) => {
    const { fulfillmentId, orderId } = input

    const { data: fulfillment } = useQueryGraphStep({
      entity: "fulfillment",
      filters: { id: fulfillmentId },
      fields: ["id"],
      options: { throwIfKeyNotFound: true, isList: false },
    }).config({ name: "get-fulfillment" })

    const { data: order } = useQueryGraphStep({
      entity: "order",
      filters: { id: orderId },
      fields: [
        "id",
        "summary",
        "total",
        "currency_code",
        "region_id",
        "fulfillments.id",
        "fulfillments.items.id",
        "fulfillments.items.quantity",
        "fulfillments.items.line_item_id",
        "fulfillments.items.inventory_item_id",
        "items.id",
        "items.quantity",
        "items.variant.manage_inventory",
        "items.variant.inventory_items.inventory.id",
        "items.variant.inventory_items.required_quantity",
      ],
      options: { throwIfKeyNotFound: true, isList: false },
    }).config({ name: "order-query" })

    orderFulfillmentDeliverablilityValidationStep({ order, fulfillment })

    const deliveryData = transform(
      { order, fulfillment },
      prepareRegisterDeliveryData
    )

    acquireLockStep({
      key: orderId,
      timeout: 2,
      ttl: 10,
    })

    const deliveredFulfillment = markFulfillmentAsDeliveredWorkflow.runAsStep({
      input: { id: fulfillment.id },
    })

    releaseLockStep({
      key: orderId,
    })

    registerOrderDeliveryStep(deliveryData)

    emitEventStep({
      eventName: FulfillmentWorkflowEvents.DELIVERY_CREATED,
      data: { id: deliveredFulfillment.id },
    })

    return new WorkflowResponse(void 0)
  }
)
