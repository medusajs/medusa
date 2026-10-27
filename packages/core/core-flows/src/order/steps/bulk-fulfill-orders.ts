import { ContainerRegistrationKeys, MathBN } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { createOrderFulfillmentWorkflow } from "../workflows/create-fulfillment"

/**
 * The data to bulk fulfill one or more orders.
 */
export type BulkFulfillOrdersStepInput = {
  /**
   * The IDs of the orders to fulfill.
   */
  order_ids: string[]
}

/**
 * The outcome of a bulk fulfillment attempt, reported per order so a
 * failure on one order never hides whether the others succeeded.
 */
export type BulkFulfillOrdersStepOutput = {
  /**
   * The IDs of the orders that were fulfilled successfully.
   */
  succeeded: string[]
  /**
   * The orders that failed to fulfill, along with the error message.
   */
  failed: { order_id: string; error: string }[]
}

export const bulkFulfillOrdersStepId = "bulk-fulfill-orders"
/**
 * This step fulfills one or more orders, one at a time, through
 * {@link createOrderFulfillmentWorkflow}.
 *
 * For each order, it only fulfills that order's own remaining unfulfilled
 * items - computed as `item.quantity - item.detail.fulfilled_quantity` for
 * every item on the order - so an order that's already `partially_fulfilled`
 * only has its remaining items fulfilled, never the ones it already shipped.
 * `location_id`/`shipping_option_id` are intentionally left for
 * {@link createOrderFulfillmentWorkflow} to resolve itself (from the order's
 * first shipping method), matching how a single-order fulfillment resolves
 * them when they aren't explicitly provided.
 *
 * Each order's fulfillment attempt is wrapped in its own try/catch - one
 * order's failure (for example, no stock reservation for an item, or an
 * incomplete shipping address the fulfillment provider rejects) is recorded
 * in `failed` and does not stop or roll back any other order in the batch.
 *
 * @example
 * const data = bulkFulfillOrdersStep({
 *   order_ids: ["order_123", "order_456"]
 * })
 */
export const bulkFulfillOrdersStep = createStep(
  bulkFulfillOrdersStepId,
  async (input: BulkFulfillOrdersStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const succeeded: string[] = []
    const failed: { order_id: string; error: string }[] = []

    for (const orderId of input.order_ids) {
      try {
        const {
          data: [order],
        } = await query.graph({
          entity: "order",
          filters: { id: orderId },
          fields: [
            "id",
            "items.id",
            "items.quantity",
            "items.detail.fulfilled_quantity",
          ],
        })

        const items = (order?.items ?? [])
          .map((item) => ({
            id: item.id,
            quantity: MathBN.sub(
              item.quantity,
              item.detail?.fulfilled_quantity ?? 0
            ),
          }))
          .filter((item) => MathBN.gt(item.quantity, 0))

        await createOrderFulfillmentWorkflow(container).run({
          input: {
            order_id: orderId,
            items,
          },
        })

        succeeded.push(orderId)
      } catch (error) {
        failed.push({ order_id: orderId, error: error.message })
      }
    }

    return new StepResponse({ succeeded, failed })
  }
)
