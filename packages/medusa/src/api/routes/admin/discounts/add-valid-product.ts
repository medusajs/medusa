import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount } from "../../../.."
import DiscountService from "../../../../services/discount"
/**
 * @oas [post] /discounts/{id}/products/{variant_id}
 * operationId: "PostDiscountsDiscountProductsProduct"
 * summary: "Adds Product availability"
 * description: "Adds a Product to the list of Products that a Discount can be used for."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Discount.
 *   - (path) variant_id=* {string} The id of the Product.
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
  const { discount_id, variant_id } = req.params

  const discountService: DiscountService = req.scope.resolve("discountService")
  await discountService.addValidProduct(discount_id, variant_id)

  const discount: Discount = await discountService.retrieve(discount_id, {
    select: defaultAdminDiscountsFields,
    relations: defaultAdminDiscountsRelations,
  })

  res.status(200).json({ discount })
}
