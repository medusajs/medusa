import {
  AdminPriceListPricesCreateReq,
  CreatePriceListInput,
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

import { EntityManager } from "typeorm"
import PriceListService from "../../../../services/price-list"
import { Request } from "express"
import { Type } from "class-transformer"

/**
 * @oas [post] /price-lists
 * operationId: "PostPriceListsPriceList"
 * summary: "Creates a Price List"
 * description: "Creates a Price List"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - name
 *           - description
 *           - type
 *           - prices
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
 *               - active
 *               - draft
 *           prices:
 *              description: The prices of the Price List.
 *              type: array
 *              items:
 *                required:
 *                  - amount
 *                  - variant_id
 *                properties:
 *                  region_id:
 *                    description: The ID of the Region for which the price is used. Only required if currecny_code is not provided.
 *                    type: string
 *                  currency_code:
 *                    description: The 3 character ISO currency code for which the price will be used. Only required if region_id is not provided.
 *                    type: string
 *                    externalDocs:
 *                      url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *                      description: See a list of codes.
 *                  amount:
 *                    description: The amount to charge for the Product Variant.
 *                    type: integer
 *                  variant_id:
 *                    description: The ID of the Variant for which the price is used.
 *                    type: string
 *                  min_quantity:
 *                    description: The minimum quantity for which the price will be used.
 *                    type: integer
 *                  max_quantity:
 *                    description: The maximum quantity for which the price will be used.
 *                    type: integer
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
export default async (req: Request, res) => {
  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const manager: EntityManager = req.scope.resolve("manager")
  const priceList = await manager.transaction(async (transactionManager) => {
    return await priceListService
      .withTransaction(transactionManager)
      .create(req.validatedBody as CreatePriceListInput)
  })

  res.json({ price_list: priceList })
}

class CustomerGroup {
  @IsString()
  id: string
}

export class AdminPostPriceListsPriceListReq {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsOptional()
  starts_at?: Date

  @IsOptional()
  ends_at?: Date

  @IsOptional()
  @IsEnum(PriceListStatus)
  status?: PriceListStatus

  @IsEnum(PriceListType)
  type: PriceListType

  @IsArray()
  @Type(() => AdminPriceListPricesCreateReq)
  @ValidateNested({ each: true })
  prices: AdminPriceListPricesCreateReq[]

  @IsOptional()
  @IsArray()
  @Type(() => CustomerGroup)
  @ValidateNested({ each: true })
  customer_groups?: CustomerGroup[]
}
