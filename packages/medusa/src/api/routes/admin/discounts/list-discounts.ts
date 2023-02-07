import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Transform, Type } from "class-transformer"

import { AdminGetDiscountsDiscountRuleParams } from "../../../../types/discount"
import { extendedFindParamsMixin } from "../../../../types/common"
import { Request, Response } from "express"
import { DiscountService } from "../../../../services"
import { optionalBooleanMapper } from "../../../../utils/validators/is-boolean"

/**
 * @oas [get] /discounts
 * operationId: "GetDiscounts"
 * summary: "List Discounts"
 * x-authenticated: true
 * description: "Retrieves a list of Discounts"
 * parameters:
 *   - (query) q {string} Search query applied on the code field.
 *   - in: query
 *     name: rule
 *     description: Discount Rules filters to apply on the search
 *     schema:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [fixed, percentage, free_shipping]
 *           description: "The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers."
 *         allocation:
 *           type: string
 *           enum: [total, item]
 *           description: "The value that the discount represents; this will depend on the type of the discount"
 *   - (query) is_dynamic {boolean} Return only dynamic discounts.
 *   - (query) is_disabled {boolean} Return only disabled discounts.
 *   - (query) limit=20 {number} The number of items in the response
 *   - (query) offset=0 {number} The offset of items in response
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetDiscountsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.discounts.list()
 *       .then(({ discounts, limit, offset, count }) => {
 *         console.log(discounts.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/discounts' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminDiscountsListRes"
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
export default async (req: Request, res: Response) => {
  const discountService: DiscountService = req.scope.resolve("discountService")

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const [discounts, count] = await discountService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    discounts,
    count,
    offset: skip,
    limit: take,
  })
}

export class AdminGetDiscountsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  @ValidateNested()
  @IsOptional()
  @Type(() => AdminGetDiscountsDiscountRuleParams)
  rule?: AdminGetDiscountsDiscountRuleParams

  @IsString()
  @IsOptional()
  q?: string

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  is_dynamic?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  is_disabled?: boolean
}
