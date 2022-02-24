import { Request } from "@interfaces/http"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import DiscountService from "../../../../services/discount"
/**
 * @oas [delete] /discounts/{id}/products/{product_id}
 * operationId: "DeleteDiscountsDiscountProductsProduct"
 * summary: "Remove Product availability"
 * description: "Removes a Product from the list of Products that a Discount can be used for."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Discount.
 *   - (path) product_id=* {string} The id of the Product.
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
export default async (req: Request, res) => {
  const { discount_id, product_id } = req.params

  const discountService: DiscountService = req.scope.resolve("discountService")
  await discountService.removeValidProduct(discount_id, product_id)

  const discount = await discountService.retrieve(discount_id, {
    select: defaultAdminDiscountsFields,
    relations: defaultAdminDiscountsRelations,
  })

  res.status(200).json({ discount })
}
