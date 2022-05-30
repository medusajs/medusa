import { Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultAdminPriceListFields, defaultAdminPriceListRelations } from "."
import { PriceList } from "../../../.."
import PriceListService from "../../../../services/price-list"
import {
  AdminPriceListPricesUpdateReq,
  PriceListStatus,
  PriceListType,
} from "../../../../types/price-list"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /price_lists/{id}
 * operationId: "PostPriceListsPriceListPriceList"
 * summary: "Update a Price List"
 * description: "Updates a Price List"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Price List.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           name:
 *             description: "The name of the Price List"
 *             type: string
 *           description:
 *             description: "A description of the Price List."
 *             type: string
 *           type:
 *             description: The type of the Price List.
 *             type: string
 *             enum:
 *              - sale
 *              - override
 *          status:
 *            description: The status of the Price List.
 *            type: string
 *            enum:
 *             - active
 *             - draft
 *          prices:
 *            description: The prices of the Price List.
 *            type: array
 *            items:
 *              properties:
 *                id:
 *                  description: The id of the price.
 *                  type: string
 *                region_id:
 *                  description: The id of the Region for which the price is used.
 *                  type: string
 *                currency_code:
 *                  description: The 3 character ISO currency code for which the price will be used.
 *                  type: string
 *                amount:
 *                  description: The amount to charge for the Product Variant.
 *                  type: integer
 *                min_quantity:
 *                  description: The minimum quantity for which the price will be used.
 *                  type: integer
 *                max_quantity:
 *                  description: The maximum quantity for which the price will be used.
 *                  type: integer
 *          customer_groups:
 *            type: array
 *             description: A list of customer groups that the Price List applies to.
 *             items:
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   description: The id of a customer group
 *                   type: string
 * tags:
 *   - Price List
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/price_list"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(
    AdminPostPriceListsPriceListPriceListReq,
    req.body
  )

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  await priceListService.update(id, validated)

  const priceList = await priceListService.retrieve(id, {
    select: defaultAdminPriceListFields as (keyof PriceList)[],
    relations: defaultAdminPriceListRelations,
  })

  res.json({ price_list: priceList })
}

class CustomerGroup {
  @IsString()
  id: string
}

export class AdminPostPriceListsPriceListPriceListReq {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  starts_at?: Date | null

  @IsOptional()
  ends_at?: Date | null

  @IsOptional()
  @IsEnum(PriceListStatus)
  status?: PriceListStatus

  @IsOptional()
  @IsEnum(PriceListType)
  type?: PriceListType

  @IsOptional()
  @IsArray()
  @Type(() => AdminPriceListPricesUpdateReq)
  @ValidateNested({ each: true })
  prices?: AdminPriceListPricesUpdateReq[]

  @IsOptional()
  @IsArray()
  @Type(() => CustomerGroup)
  @ValidateNested({ each: true })
  customer_groups?: CustomerGroup[]
}
