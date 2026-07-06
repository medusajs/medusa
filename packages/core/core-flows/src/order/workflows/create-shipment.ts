import {
  AdditionalData,
  BigNumberInput,
  FulfillmentDTO,
  InventoryItemDTO,
  OrderDTO,
  OrderLineItemDTO,
  OrderWorkflow,
  ProductVariantDTO,
} from "@medusajs/framework/types"
import {
  FulfillmentWorkflowEvents,
  MathBN,
  Modules,
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
import { emitEventStep, useQueryGraphStep } from "../../common"
import { createShipmentWorkflow } from "../../fulfillment"
import { registerOrderShipmentStep } from "../steps"
import {
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderIsCancelled,
} from "../utils/order-validation"

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

export type CreateShipmentValidateOrderStepInput = {
  /**
   * The order to create the shipment for.
   */
  order: OrderDTO
  /**
   * The shipment creation details.
   */
  input: OrderWorkflow.CreateOrderShipmentWorkflowInput
}

/**
 * This step validates that a shipment can be created for an order. If the order is cancelled,
 * the items don't exist in the order, or the fulfillment doesn't exist in the order,
 * the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = createShipmentValidateOrder({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   input: {
 *     order_id: "order_123",
 *     fulfillment_id: "ful_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         quantity: 1
 *       }
 *     ]
 *   }
 * })
 */
export const createShipmentValidateOrder = createStep(
  "create-shipment-validate-order",
  ({ order, input }: CreateShipmentValidateOrderStepInput) => {
    const inputItems = input.items

    throwIfOrderIsCancelled({ order })
    throwIfItemsDoesNotExistsInOrder({ order, inputItems })

    const order_ = order as OrderDTO & { fulfillments: FulfillmentDTO[] }
    const fulfillment = order_.fulfillments.find(
      (f) => f.id === input.fulfillment_id
    )
    if (!fulfillment) {
      throw new Error(
        `Fulfillment with id ${input.fulfillment_id} not found in the order`
      )
    }
  }
)

function prepareRegisterShipmentData({
  order,
  input,
}: {
  order: OrderDTO
  input: OrderWorkflow.CreateOrderShipmentWorkflowInput
}) {
  const fulfillId = input.fulfillment_id
  const order_ = order as OrderDTO & { fulfillments: FulfillmentDTO[] }
  const fulfillment = order_.fulfillments.find((f) => f.id === fulfillId)!

  const lineItemIds = new Array(
    ...new Set(fulfillment.items.map((i) => i.line_item_id))
  )

  return {
    order_id: order.id,
    reference: Modules.FULFILLMENT,
    reference_id: fulfillment.id,
    created_by: input.created_by,
    items: lineItemIds.map((lineItemId) => {
      // find order item
      const orderItem = order.items!.find(
        (i) => i.id === lineItemId
      ) as OrderItemWithVariantDTO
      // find inventory items
      const iitems = orderItem!.variant?.inventory_items
      // find fulfillment item
      const fitem = fulfillment.items.find(
        (i) => i.line_item_id === lineItemId
      )!

      let quantity: BigNumberInput = fitem.quantity

      // NOTE: if the order item has an inventory kit or `required_qunatity` > 1, fulfillment items wont't match 1:1 with order items.
      // - for each inventory item in the kit, a fulfillment item will be created i.e. one line item could have multiple fulfillment items
      // - the quantity of the fulfillment item will be the quantity of the order item multiplied by the required quantity of the inventory item
      //
      //   We need to take this into account when creating a shipment to compute quantity of line items being shipped based on fulfillment items and qunatities.
      //   NOTE: for now we only need to find one inventory item of a line item to compute this since when a fulfillment is created all inventory items are fulfilled together.
      //   If we allow to cancel partial fulfillments for an order item, we need to change this.

      if (iitems?.length) {
        const iitem = iitems.find(
          (i) => i.inventory.id === fitem.inventory_item_id
        )

        quantity = MathBN.div(quantity, iitem!.required_quantity)
      }

      return {
        id: lineItemId as string,
        quantity,
      }
    }),
  }
}

/**
 * The data to create a shipment for an order, along with custom data that's passed to the workflow's hooks.
 */
export type CreateOrderShipmentWorkflowInput =
  OrderWorkflow.CreateOrderShipmentWorkflowInput & AdditionalData

export const createOrderShipmentWorkflowId = "create-order-shipment"
/**
 * This workflow creates a shipment for an order. It's used by the [Create Order Shipment Admin API Route](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idshipments).
 *
 * This workflow has a hook that allows you to perform custom actions on the created shipment. For example, you can pass under `additional_data` custom data that
 * allows you to create custom data models linked to the shipment.
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around creating a shipment.
 *
 * @example
 * const { result } = await createOrderShipmentWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     fulfillment_id: "fulfillment_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         quantity: 1
 *       }
 *     ],
 *     additional_data: {
 *       oms_id: "123"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Creates a shipment for an order.
 *
 * @property hooks.shipmentCreated - This hook is executed after the shipment is created. You can consume this hook to perform custom actions on the created shipment.
 */
export const createOrderShipmentWorkflow = createWorkflow(
  createOrderShipmentWorkflowId,
  (input: WorkflowData<CreateOrderShipmentWorkflowInput>) => {
    const { data: order } = useQueryGraphStep({
      entity: "order",
      filters: { id: input.order_id },
      fields: [
        "id",
        "status",
        "region_id",
        "currency_code",
        "items.id",
        "items.quantity",
        "items.variant.manage_inventory",
        "items.variant.inventory_items.inventory.id",
        "items.variant.inventory_items.required_quantity",
        "fulfillments.*",
        "fulfillments.items.id",
        "fulfillments.items.quantity",
        "fulfillments.items.line_item_id",
        "fulfillments.items.inventory_item_id",
      ],
      options: { throwIfKeyNotFound: true, isList: false },
    }).config({ name: "get-order" })

    createShipmentValidateOrder({ order, input })

    const fulfillmentData = transform({ input }, ({ input }) => {
      return {
        id: input.fulfillment_id,
        labels: input.labels ?? [],
        marked_shipped_by: input.created_by,
      }
    })

    const shipmentData = transform(
      { order, input },
      prepareRegisterShipmentData
    )

    const [shipment] = parallelize(
      createShipmentWorkflow.runAsStep({
        input: fulfillmentData,
      }),
      registerOrderShipmentStep(shipmentData)
    )

    emitEventStep({
      eventName: FulfillmentWorkflowEvents.SHIPMENT_CREATED,
      data: { id: shipment.id, no_notification: input.no_notification },
    })

    const shipmentCreated = createHook("shipmentCreated", {
      shipment,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(void 0, {
      hooks: [shipmentCreated],
    })
  }
)
