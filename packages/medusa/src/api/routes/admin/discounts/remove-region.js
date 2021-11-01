import { defaultFields, defaultRelations } from "./"

/**
 * @oas [delete] /discounts/{id}/regions/{region_id}
 * operationId: "DeleteDiscountsDiscountRegionsRegion"
 * summary: "Remove Region availability"
 * description: "Removes a Region from the list of Regions that a Discount can be used in."
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
  await discountService.removeRegion(discount_id, region_id)

  const discount = await discountService.retrieve(discount_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ discount })
}
