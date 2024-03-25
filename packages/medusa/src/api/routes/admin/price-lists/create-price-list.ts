import { PriceListStatus, PriceListType } from "@medusajs/utils"
import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Request } from "express"
import { EntityManager } from "typeorm"
import { defaultAdminPriceListFields, defaultAdminPriceListRelations } from "."
import { featureFlagRouter } from "../../../../loaders/feature-flags"
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"
import { PriceList } from "../../../../models"
import PriceListService from "../../../../services/price-list"
import {
  AdminPriceListPricesCreateReq,
  CreatePriceListInput,
} from "../../../../types/price-list"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { transformOptionalDate } from "../../../../utils/validators/date-transform"

/**
 * @oas [post] /admin/price-lists
 * operationId: "PostPriceListsPriceList"
 * summary: "Create a Price List"
 * description: "Create a Price List."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostPriceListsPriceListReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       import { PriceListType } from "@medusajs/medusa"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.priceLists.create({
 *         name: "New Price List",
 *         description: "A new price list",
 *         type: PriceListType.SALE,
 *         prices: [
 *           {
 *             amount: 1000,
 *             variant_id,
 *             currency_code: "eur"
 *           }
 *         ]
 *       })
 *       .then(({ price_list }) => {
 *         console.log(price_list.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import {
 *         PriceListStatus,
 *         PriceListType,
 *       } from "@medusajs/medusa"
 *       import { useAdminCreatePriceList } from "medusa-react"
 *
 *       type CreateData = {
 *         name: string
 *         description: string
 *         type: PriceListType
 *         status: PriceListStatus
 *         prices: {
 *           amount: number
 *           variant_id: string
 *           currency_code: string
 *           max_quantity: number
 *         }[]
 *       }
 *
 *       const CreatePriceList = () => {
 *         const createPriceList = useAdminCreatePriceList()
 *         // ...
 *
 *         const handleCreate = (
 *           data: CreateData
 *         ) => {
 *           createPriceList.mutate(data, {
 *             onSuccess: ({ price_list }) => {
 *               console.log(price_list.id)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default CreatePriceList
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/price-lists' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "New Price List",
 *           "description": "A new price list",
 *           "type": "sale",
 *           "prices": [
 *             {
 *               "amount": 1000,
 *               "variant_id": "afafa",
 *               "currency_code": "eur"
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Price Lists
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPriceListRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res) => {
  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const manager: EntityManager = req.scope.resolve("manager")

  let priceList = await manager.transaction(async (transactionManager) => {
    return await priceListService
      .withTransaction(transactionManager)
      .create(req.validatedBody as CreatePriceListInput)
  })

  priceList = await priceListService.retrieve(priceList.id, {
    select: defaultAdminPriceListFields as (keyof PriceList)[],
    relations: defaultAdminPriceListRelations,
  })

  res.json({ price_list: priceList })
}

class CustomerGroup {
  @IsString()
  id: string
}

/**
 * @schema AdminPostPriceListsPriceListReq
 * type: object
 * description: "The details of the price list to create."
 * required:
 *   - name
 *   - description
 *   - type
 *   - prices
 * properties:
 *   name:
 *     description: "The name of the Price List."
 *     type: string
 *   description:
 *     description: "The description of the Price List."
 *     type: string
 *   starts_at:
 *     description: "The date with timezone that the Price List starts being valid."
 *     type: string
 *     format: date
 *   ends_at:
 *     description: "The date with timezone that the Price List ends being valid."
 *     type: string
 *     format: date
 *   type:
 *     description: The type of the Price List.
 *     type: string
 *     enum:
 *      - sale
 *      - override
 *   status:
 *     description: >-
 *       The status of the Price List. If the status is set to `draft`, the prices created in the price list will not be available of the customer.
 *     type: string
 *     enum:
 *       - active
 *       - draft
 *   prices:
 *      description: The prices of the Price List.
 *      type: array
 *      items:
 *        type: object
 *        required:
 *          - amount
 *          - variant_id
 *        properties:
 *          region_id:
 *            description: The ID of the Region for which the price is used. This is only required if `currecny_code` is not provided.
 *            type: string
 *          currency_code:
 *            description: The 3 character ISO currency code for which the price will be used. This is only required if `region_id` is not provided.
 *            type: string
 *            externalDocs:
 *              url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *              description: See a list of codes.
 *          amount:
 *            description: The amount to charge for the Product Variant.
 *            type: integer
 *          variant_id:
 *            description: The ID of the Variant for which the price is used.
 *            type: string
 *          min_quantity:
 *            description: The minimum quantity for which the price will be used.
 *            type: integer
 *          max_quantity:
 *            description: The maximum quantity for which the price will be used.
 *            type: integer
 *   customer_groups:
 *     type: array
 *     description: An array of customer groups that the Price List applies to.
 *     items:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: The ID of a customer group
 *           type: string
 *   includes_tax:
 *      description: "Tax included in prices of price list"
 *      x-featureFlag: "tax_inclusive_pricing"
 *      type: boolean
 */
export class AdminPostPriceListsPriceListReq {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsOptional()
  @Transform(transformOptionalDate)
  starts_at?: Date

  @IsOptional()
  @Transform(transformOptionalDate)
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

  @FeatureFlagDecorators(TaxInclusivePricingFeatureFlag.key, [
    IsOptional(),
    IsBoolean(),
  ])
  includes_tax?: boolean
}
