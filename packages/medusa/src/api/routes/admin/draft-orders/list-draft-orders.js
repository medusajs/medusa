import { defaultFields, defaultRelations } from "./"

/**
 * @oas [get] /draft-orders
 * operationId: "GetDraftOrders"
 * summary: "List Draft Orders"
 * description: "Retrieves an list of Draft Orders"
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
  const draftOrderService = req.scope.resolve("draftOrderService")

  const limit = parseInt(req.query.limit) || 50
  const offset = parseInt(req.query.offset) || 0

  const selector = {}

  if ("q" in req.query) {
    selector.q = req.query.q
  }

  const listConfig = {
    select: defaultFields,
    relations: defaultRelations,
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const [draftOrders, count] = await draftOrderService.listAndCount(
    selector,
    listConfig
  )

  res.json({ draft_orders: draftOrders, count, offset, limit })
}
