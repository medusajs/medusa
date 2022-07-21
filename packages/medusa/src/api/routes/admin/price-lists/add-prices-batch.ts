import { IsArray, IsBoolean, IsOptional, ValidateNested } from "class-validator"
import { defaultAdminPriceListFields, defaultAdminPriceListRelations } from "."

import { AdminPriceListPricesUpdateReq } from "../../../../types/price-list"
import { PriceList } from "../../../.."
import PriceListService from "../../../../services/price-list"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /price-lists/{id}/prices/batch
 * operationId: "PostPriceListsPriceListPricesBatch"
 * summary: "Batch update prices for a Price List"
 * description: "Batch update prices for a Price List"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Price List to update prices for.
 * requestBody:
 *  content:
 *    application/json:
 *      schema:
 *        properties:
 *          prices:
 *            description: The prices to update or add.
 *            type: array
 *            items:
 *              properties:
 *                id:
 *                  description: The id of the price.
 *                  type: string
 *                status:
 *                  description: The status of the Price List.
 *                  type: string
 *                  enum:
 *                    - active
 *                    - draft
 *                region_id:
 *                  description: The id of the Region for which the price is used.
 *                  type: string
 *                currency_code:
 *                  description: The 3 character ISO currency code for which the price will be used.
 *                  type: string
 *                amount:
 *                  description: The amount of the price.
 *                  type: number
 *                min_quantity:
 *                  description: The minimum quantity for which the price will be used.
 *                  type: number
 *                max_quantity:
 *                 description: The maximum quantity for which the price will be used.
 *                 type: number
 *          override:
 *            description: "If true the prices will replace all existing prices associated with the Price List."
 *            type: boolean
 * tags:
 *   - Price List
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             price_list:
 *               $ref: "#/components/schemas/price_list"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(AdminPostPriceListPricesPricesReq, req.body)

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  await priceListService.addPrices(id, validated.prices, validated.override)

  const priceList = await priceListService.retrieve(id, {
    select: defaultAdminPriceListFields as (keyof PriceList)[],
    relations: defaultAdminPriceListRelations,
  })

  res.json({ price_list: priceList })
}

export class AdminPostPriceListPricesPricesReq {
  @IsArray()
  @Type(() => AdminPriceListPricesUpdateReq)
  @ValidateNested({ each: true })
  prices: AdminPriceListPricesUpdateReq[]

  @IsOptional()
  @IsBoolean()
  override?: boolean
}
