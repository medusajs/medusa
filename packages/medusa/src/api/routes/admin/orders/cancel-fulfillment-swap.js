import { MedusaError } from "medusa-core-utils"

/**
 * @oas [post] /{id}/swaps/{swap_id}/fulfillments/{fulfillment_id}/cancel
 * operationId: "PostOrdersSwapFulfillmentsCancel"
 * summary: "Cancels a fulfilmment related to a Swap"
 * description: "Registers a Fulfillment as canceled."
 * parameters:
 *   - (path) id=* {string} The id of the Order which the Swap relates to.
 *   - (path) swap_id=* {string} The id of the Swap which the Fulfillment relates to.
 *   - (path) fulfillment_id=* {string} The id of the Fulfillment.
 * tags:
 *   - Fulfillment
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             fulfillment:
 *               $ref: "#/components/schemas/fulfillment"
 */
export default async (req, res) => {
  const { id, swap_id, fulfillment_id } = req.params

  try {
    const fulfillmentService = req.scope.resolve("fulfillmentService")
    const swapService = req.scope.resolve("swapService")

    const fulfillment = await fulfillmentService.retrieve(fulfillment_id)

    if (fulfillment.swap_id !== swap_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `no fulfillment was found with the id: ${fulfillment_id} related to swap: ${id}`
      )
    }

    const swap = await swapService.retrieve(swap_id)

    if (swap.order_id !== id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `no swap was found with the id: ${swap_id} related to order: ${id}`
      )
    }

    await fulfillmentService.cancelFulfillment(fulfillment_id)

    const result = await fulfillmentService.retrieve(fulfillment_id)

    res.json({ result })
  } catch (error) {
    throw error
  }
}
