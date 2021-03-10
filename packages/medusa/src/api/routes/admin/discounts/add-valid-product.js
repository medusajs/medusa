import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /discounts/{id}/products/{product_id}
 * operationId: "PostDiscountsDiscountProductsProduct"
 * summary: "Adds Product availability"
 * description: "Adds a Product to the list of Products that a Discount can be used for."
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
export default async (req, res) => {
  const { discount_id, variant_id } = req.params

  try {
    const discountService = req.scope.resolve("discountService")

    await discountService.addValidProduct(discount_id, variant_id)

    const discount = await discountService.retrieve(discount_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ discount })
  } catch (err) {
    throw err
  }
}
