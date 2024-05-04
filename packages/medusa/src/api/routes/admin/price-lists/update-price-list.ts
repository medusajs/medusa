import { PriceListStatus, PriceListType } from "@medusajs/utils"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultAdminPriceListFields, defaultAdminPriceListRelations } from "."

import { Transform, Type } from "class-transformer"
import { EntityManager } from "typeorm"
import { PriceList } from "../../../.."
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"
import PriceListService from "../../../../services/price-list"
import { AdminPriceListPricesUpdateReq } from "../../../../types/price-list"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { validator } from "../../../../utils/validator"
import { transformOptionalDate } from "../../../../utils/validators/date-transform"

/**
 * @oas [post] /admin/price-lists/{id}
 * operationId: "PostPriceListsPriceListPriceList"
 * summary: "Update a Price List"
 * description: "Update a Price List's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Price List.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostPriceListsPriceListPriceListReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.priceLists.update(priceListId, {
 *         name: "New Price List"
 *       })
 *       .then(({ price_list }) => {
 *         console.log(price_list.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminUpdatePriceList } from "medusa-react"
 *
 *       type Props = {
 *         priceListId: string
 *       }
 *
 *       const PriceList = ({
 *         priceListId
 *       }: Props) => {
 *         const updatePriceList = useAdminUpdatePriceList(priceListId)
 *         // ...
 *
 *         const handleUpdate = (
 *           endsAt: Date
 *         ) => {
 *           updatePriceList.mutate({
 *             ends_at: endsAt,
 *           }, {
 *             onSuccess: ({ price_list }) => {
 *               console.log(price_list.ends_at)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default PriceList
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/price-lists/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "New Price List"
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
export default async (req, res) => {
  const { id } = req.params
  const manager: EntityManager = req.scope.resolve("manager")
  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const validated = await validator(
    AdminPostPriceListsPriceListPriceListReq,
    req.body
  )

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

/**
 * @schema AdminPostPriceListsPriceListPriceListReq
 * type: object
 * description: "The details to update of the payment collection."
 * properties:
 *   name:
 *     description: "The name of the Price List"
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
 *      - active
 *      - draft
 *   prices:
 *     description: The prices of the Price List.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - amount
 *         - variant_id
 *       properties:
 *         id:
 *           description: The ID of the price.
 *           type: string
 *         region_id:
 *           description: The ID of the Region for which the price is used. This is only required if `currecny_code` is not provided.
 *           type: string
 *         currency_code:
 *           description: The 3 character ISO currency code for which the price will be used. This is only required if `region_id` is not provided.
 *           type: string
 *           externalDocs:
 *              url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *              description: See a list of codes.
 *         variant_id:
 *           description: The ID of the Variant for which the price is used.
 *           type: string
 *         amount:
 *           description: The amount to charge for the Product Variant.
 *           type: integer
 *         min_quantity:
 *           description: The minimum quantity for which the price will be used.
 *           type: integer
 *         max_quantity:
 *           description: The maximum quantity for which the price will be used.
 *           type: integer
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
 *     description: "Tax included in prices of price list"
 *     x-featureFlag: "tax_inclusive_pricing"
 *     type: boolean
 */
export class AdminPostPriceListsPriceListPriceListReq {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  @Transform(transformOptionalDate)
  starts_at?: Date | null

  @IsOptional()
  @Transform(transformOptionalDate)
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

  @FeatureFlagDecorators(TaxInclusivePricingFeatureFlag.key, [
    IsOptional(),
    IsBoolean(),
  ])
  includes_tax?: boolean
}
