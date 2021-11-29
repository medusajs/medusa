import { defaultAdminDiscountsRelations } from "."
import { DiscountService, ServiceIdentifiers } from "../../../../services"
/**
 * @oas [get] /discounts/code/{code}
 * operationId: "GetDiscountsDiscountCode"
 * summary: "Retrieve a Discount by code"
 * description: "Retrieves a Discount by its discount code"
 * x-authenticated: true
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

  const discountService: DiscountService = req.scope.resolve(ServiceIdentifiers.discountService)
  const discount = await discountService.retrieveByCode(
    code,
    defaultAdminDiscountsRelations
  )

  res.status(200).json({ discount })
}
