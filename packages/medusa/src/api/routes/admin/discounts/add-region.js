import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /discounts/{id}/regions/{region_id}
 * operationId: "PostDiscountsDiscountRegionsRegion"
 * summary: "Adds Region availability"
 * description: "Adds a Region to the list of Regions that a Discount can be used in."
 * parameters:
 *   - (path) id=* {string} The id of the Discount.
 *   - (path) region_id=* {string} The id of the Region.
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
  const { discount_id, region_id } = req.params
  const discountService = req.scope.resolve("discountService")
  await discountService.addRegion(discount_id, region_id)

  const discount = await discountService.retrieve(discount_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ discount })
}
