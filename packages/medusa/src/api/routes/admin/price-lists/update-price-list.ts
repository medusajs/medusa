import {
  AdminPriceListPricesUpdateReq,
  PriceListStatus,
  PriceListType,
} from "../../../../types/price-list"
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
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /price-lists/{id}
 * operationId: "PostPriceListsPriceListPriceList"
 * summary: "Update a Price List"
 * description: "Updates a Price List"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Price List.
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
 *           starts_at:
 *             description: "The date with timezone that the Price List starts being valid."
 *             type: string
 *             format: date
 *           ends_at:
 *             description: "The date with timezone that the Price List ends being valid."
 *             type: string
 *             format: date
 *           type:
 *             description: The type of the Price List.
 *             type: string
 *             enum:
 *              - sale
 *              - override
 *           status:
 *             description: The status of the Price List.
 *             type: string
 *             enum:
 *              - active
 *              - draft
 *           prices:
 *             description: The prices of the Price List.
 *             type: array
 *             items:
 *               required:
 *                 - amount
 *                 - variant_id
 *               properties:
 *                 id:
 *                   description: The ID of the price.
 *                   type: string
 *                 region_id:
 *                   description: The ID of the Region for which the price is used. Only required if currecny_code is not provided.
 *                   type: string
 *                 currency_code:
 *                   description: The 3 character ISO currency code for which the price will be used. Only required if region_id is not provided.
 *                   type: string
 *                   externalDocs:
 *                      url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *                      description: See a list of codes.
 *                 variant_id:
 *                   description: The ID of the Variant for which the price is used.
 *                   type: string
 *                 amount:
 *                   description: The amount to charge for the Product Variant.
 *                   type: integer
 *                 min_quantity:
 *                   description: The minimum quantity for which the price will be used.
 *                   type: integer
 *                 max_quantity:
 *                   description: The maximum quantity for which the price will be used.
 *                   type: integer
 *           customer_groups:
 *             type: array
 *             description: A list of customer groups that the Price List applies to.
 *             items:
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   description: The ID of a customer group
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
 *             price_list:
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

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await priceListService
      .withTransaction(transactionManager)
      .update(id, validated)
  })

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
