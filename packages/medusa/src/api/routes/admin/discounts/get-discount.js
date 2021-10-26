import { defaultFields, defaultRelations } from "./"

/**
 * @oas [get] /discounts/{id}
 * operationId: "GetDiscountsDiscount"
 * summary: "Retrieve a Discount"
 * description: "Retrieves a Discount"
 * parameters:
 *   - (path) id=* {string} The id of the Discount
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
  const { discount_id } = req.params
  const discountService = req.scope.resolve("discountService")
  const data = await discountService.retrieve(discount_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ discount: data })
}
