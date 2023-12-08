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
 * @oas [get] /admin/discounts
 * operationId: "GetDiscounts"
 * summary: "List Discounts"
 * x-authenticated: true
 * description: "Retrieve a list of Discounts. The discounts can be filtered by fields such as `rule` or `is_dynamic`. The discounts can also be paginated."
 * parameters:
 *   - (query) q {string} term to search discounts' code field.
 *   - in: query
 *     name: rule
 *     description: Filter discounts by rule fields.
 *     schema:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [fixed, percentage, free_shipping]
 *           description: "Filter discounts by type."
 *         allocation:
 *           type: string
 *           enum: [total, item]
 *           description: "Filter discounts by allocation type."
 *   - (query) is_dynamic {boolean} Filter discounts by whether they're dynamic or not.
 *   - (query) is_disabled {boolean} Filter discounts by whether they're disabled or not.
 *   - (query) limit=20 {number} The number of discounts to return
 *   - (query) offset=0 {number} The number of discounts to skip when retrieving the discounts.
 *   - (query) expand {string} Comma-separated relations that should be expanded in each returned discount.
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
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/discounts' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Discounts
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

/**
 * Parameters used to filter and configure the pagination of the retrieved discounts.
 */
export class AdminGetDiscountsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  /**
   * Filter discounts by their associated rule.
   */
  @ValidateNested()
  @IsOptional()
  @Type(() => AdminGetDiscountsDiscountRuleParams)
  rule?: AdminGetDiscountsDiscountRuleParams

  /**
   * Search terms to search discounts' code fields.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * Filter discounts by whether they're dynamic.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  is_dynamic?: boolean

  /**
   * Filter discounts by whether they're disabled.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  is_disabled?: boolean
}
