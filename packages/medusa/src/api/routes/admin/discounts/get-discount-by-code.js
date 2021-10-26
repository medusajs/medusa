import { defaultRelations } from "./"

/**
 * @oas [get] /discounts/code/{code}
 * operationId: "GetDiscountsDiscountCode"
 * summary: "Retrieve a Discount by code"
 * description: "Retrieves a Discount by its discount code"
 * parameters:
 *   - (path) code=* {string} The code of the Discount
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
  const { code } = req.params
  const discountService = req.scope.resolve("discountService")
  const discount = await discountService.retrieveByCode(code, defaultRelations)

  res.status(200).json({ discount })
}
