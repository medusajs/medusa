import { DiscountService, ServiceIdentifiers } from "../../../../services"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
/**
 * @oas [delete] /discounts/{id}/regions/{region_id}
 * operationId: "DeleteDiscountsDiscountRegionsRegion"
 * summary: "Remove Region availability"
 * x-authenticated: true
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

  const discountService: DiscountService = req.scope.resolve(ServiceIdentifiers.discountService)
  await discountService.removeRegion(discount_id, region_id)

  const discount = await discountService.retrieve(discount_id, {
    select: defaultAdminDiscountsFields,
    relations: defaultAdminDiscountsRelations,
  })

  res.status(200).json({ discount })
}
