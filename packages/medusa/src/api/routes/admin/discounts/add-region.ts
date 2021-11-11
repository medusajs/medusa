import { IsNotEmpty, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."
import { Discount } from "../../../.."
import DiscountService from "../../../../services/discount"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /discounts/{id}/regions/{region_id}
 * operationId: "PostDiscountsDiscountRegionsRegion"
 * summary: "Adds Region availability"
 * description: "Adds a Region to the list of Regions that a Discount can be used in."
 * x-authenticated: true
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
  const { discount_id, region_id } = await validator(
    AdminPostDiscountsDiscountRegionsRegionReq,
    req.params
  )
  const discountService: DiscountService = req.scope.resolve("discountService")
  await discountService.addRegion(discount_id, region_id)

  const discount: Discount = await discountService.retrieve(discount_id, {
    select: defaultAdminDiscountsFields,
    relations: defaultAdminDiscountsRelations,
  })

  res.status(200).json({ discount })
}

export class AdminPostDiscountsDiscountRegionsRegionReq {
  @IsString()
  @IsNotEmpty()
  discount_id: string

  @IsString()
  @IsNotEmpty()
  region_id: string
}
