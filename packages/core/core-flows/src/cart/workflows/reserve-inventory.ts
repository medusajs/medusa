import type { CartDTO, OrderDTO } from "@medusajs/framework/types"
import {
  createHook,
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  reserveInventoryStep,
  ReserveVariantInventoryStepInput,
} from "../steps/reserve-inventory"
import { reservationAllocationsResult } from "../utils/schemas"

/**
 * The details of the items to reserve inventory for.
 */
export interface ReserveInventoryWorkflowInput {
  /**
   * The items to reserve inventory quantities for.
   */
  items: ReserveVariantInventoryStepInput["items"]
  /**
   * The cart the reservations originate from, when reserving as part of
   * cart completion. Passed to the `setReservationAllocations` hook for
   * context.
   */
  cart?: CartDTO
  /**
   * The order the reservations belong to. Passed to the
   * `setReservationAllocations` hook for context.
   */
  order?: OrderDTO
}

export const reserveInventoryWorkflowId = "reserve-inventory"
/**
 * This workflow reserves the quantities of line items at stock locations. It's
 * used by the {@link completeCartWorkflow} when an order is placed.
 *
 * By default, an item's full quantity is reserved at the first candidate
 * stock location. When no single location covers the full quantity, the
 * reservation is split across the candidate locations based on each
 * location's availability.
 *
 * The workflow has a hook to customize at which stock locations quantities are
 * reserved, useful for use cases like in-store pickup or routing orders to
 * preferred warehouses.
 *
 * @example
 * const { result } = await reserveInventoryWorkflow(container)
 * .run({
 *   input: {
 *     items: [{
 *       id: "orli_123",
 *       inventory_item_id: "iitem_123",
 *       required_quantity: 1,
 *       allow_backorder: false,
 *       quantity: 2,
 *       location_ids: ["sloc_123", "sloc_456"],
 *       location_availability: [
 *         { location_id: "sloc_123", available_quantity: 1 },
 *         { location_id: "sloc_456", available_quantity: 1 },
 *       ],
 *     }]
 *   }
 * })
 *
 * @summary
 *
 * Reserve line item quantities at stock locations.
 *
 * @property hooks.setReservationAllocations - This hook is executed before the reservations are created. You can consume this hook to customize at which stock locations the items' quantities are reserved — for example, to reserve at a pickup store the customer selected. Return an array of allocations for the items whose distribution you want to override; items you don't return keep the default behavior. Each returned allocation must reference the item's `line_item_id` and `inventory_item_id`, and its quantities must add up to the item's `required_quantity * quantity`. You can use the `computeReservationAllocations` utility from `@medusajs/medusa/core-flows` to compute the default plan and adjust it.
 *
 * For example:
 *
 * ```ts
 * import { reserveInventoryWorkflow } from "@medusajs/medusa/core-flows";
 * import { StepResponse } from "@medusajs/workflows-sdk";
 *
 * reserveInventoryWorkflow.hooks.setReservationAllocations(
 *   ({ items, cart }, { container }) => {
 *     const pickupLocationId = cart?.metadata?.pickup_location_id;
 *
 *     if (!pickupLocationId) {
 *       return new StepResponse(undefined);
 *     }
 *
 *     return new StepResponse(
 *       items.map((item) => ({
 *         line_item_id: item.id,
 *         inventory_item_id: item.inventory_item_id,
 *         allocations: [
 *           {
 *             location_id: pickupLocationId,
 *             quantity: item.required_quantity * item.quantity,
 *           },
 *         ],
 *       }))
 *     );
 *   }
 * );
 * ```
 */
export const reserveInventoryWorkflow = createWorkflow(
  reserveInventoryWorkflowId,
  (input: WorkflowData<ReserveInventoryWorkflowInput>) => {
    const setReservationAllocations = createHook(
      "setReservationAllocations",
      {
        items: input.items,
        cart: input.cart,
        order: input.order,
      },
      {
        resultValidator: reservationAllocationsResult,
      }
    )

    const setReservationAllocationsResult =
      setReservationAllocations.getResult()

    const reserveInput = transform(
      { input, setReservationAllocationsResult },
      ({ input, setReservationAllocationsResult }) => {
        return {
          items: input.items,
          allocations: setReservationAllocationsResult,
        }
      }
    )

    const reservations = reserveInventoryStep(reserveInput)

    return new WorkflowResponse(reservations, {
      hooks: [setReservationAllocations],
    })
  }
)
