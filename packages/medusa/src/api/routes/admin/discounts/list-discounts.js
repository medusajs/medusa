import { defaultFields, defaultRelations } from "./"

/**
 * @oas [get] /discounts
 * operationId: "GetDiscounts"
 * summary: "List Discounts"
 * description: "Retrieves a list of Discounts"
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             discount:
 *               $ref: "#/components/schemas/discount"
 */
export default async (req, res) => {
  try {
    const discountService = req.scope.resolve("discountService")

    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0

    let selector = {}

    if ("q" in req.query) {
      selector.q = req.query.q
    }

    if ("is_dynamic" in req.query) {
      selector.is_dynamic = req.query.is_dynamic === "true"
    }

    if ("is_disabled" in req.query) {
      selector.is_disabled = req.query.is_disabled === "true"
    }

    const listConfig = {
      select: defaultFields,
      relations: defaultRelations,
      skip: offset,
      take: limit,
      order: { created_at: "DESC" },
    }

    const [discounts, count] = await discountService.listAndCount(
      selector,
      listConfig
    )

    res.status(200).json({ discounts, count, offset, limit })
  } catch (err) {
    throw err
  }
}
