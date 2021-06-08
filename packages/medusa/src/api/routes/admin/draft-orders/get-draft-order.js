import {
  defaultRelations,
  defaultFields,
  defaultCartRelations,
  defaultCartFields,
} from "."

/**
 * @oas [get] /draft-orders/{id}
 * operationId: "GetDraftOrdersDraftOrder"
 * summary: "Retrieve a Draft Order"
 * description: "Retrieves a Draft Order."
 * parameters:
 *   - (path) id=* {string} The id of the Draft Order.
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             draft_order:
 *               $ref: "#/components/schemas/draft-order"
 */

export default async (req, res) => {
  const { id } = req.params

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    const cartService = req.scope.resolve("cartService")

    const draftOrder = await draftOrderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    draftOrder.cart = await cartService.retrieve(draftOrder.cart_id, {
      relations: defaultCartRelations,
      select: defaultCartFields,
    })

    res.json({ draft_order: draftOrder })
  } catch (error) {
    throw error
  }
}
