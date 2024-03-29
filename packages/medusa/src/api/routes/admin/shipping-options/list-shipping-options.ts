import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"

import { Transform, Type } from "class-transformer"
import { Request, Response } from "express"
import { PricingService, ShippingOptionService } from "../../../../services"
import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"
import { IsType } from "../../../../utils"
import { optionalBooleanMapper } from "../../../../utils/validators/is-boolean"

/**
 * @oas [get] /admin/shipping-options
 * operationId: "GetShippingOptions"
 * summary: "List Shipping Options"
 * description: "Retrieve a list of Shipping Options. The shipping options can be filtered by fields such as `region_id` or `is_return`. The shipping options can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) name {string} Filter by name.
 *   - (query) region_id {string} Filter by the ID of the region the shipping options belong to.
 *   - (query) is_return {boolean} Filter by whether the shipping options are return shipping options.
 *   - (query) admin_only {boolean} Filter by whether the shipping options are available for admin users only.
 *   - (query) q {string} Term used to search shipping options' name.
 *   - (query) order {string} A shipping option field to sort-order the retrieved shipping options by.
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by shipping option IDs.
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: ID of the shipping option.
 *         - type: array
 *           items:
 *             type: string
 *             description: ID of a shipping option.
 *   - in: query
 *     name: created_at
 *     description: Filter by a creation date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Filter by an update date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: deleted_at
 *     description: Filter by a deletion date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - (query) offset=0 {integer} The number of users to skip when retrieving the shipping options.
 *   - (query) limit=20 {integer} Limit the number of shipping options returned.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned shipping options.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned shipping options.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetShippingOptionsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.shippingOptions.list()
 *       .then(({ shipping_options, count }) => {
 *         console.log(shipping_options.length);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminShippingOptions } from "medusa-react"
 *
 *       const ShippingOptions = () => {
 *         const {
 *           shipping_options,
 *           isLoading
 *         } = useAdminShippingOptions()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {shipping_options && !shipping_options.length && (
 *               <span>No Shipping Options</span>
 *             )}
 *             {shipping_options && shipping_options.length > 0 && (
 *               <ul>
 *                 {shipping_options.map((option) => (
 *                   <li key={option.id}>{option.name}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default ShippingOptions
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/shipping-options' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Shipping Options
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminShippingOptionsListRes"
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
  const optionService: ShippingOptionService = req.scope.resolve(
    "shippingOptionService"
  )
  const pricingService: PricingService = req.scope.resolve("pricingService")

  const listConfig = req.listConfig
  const filterableFields = req.filterableFields

  const [data, count] = await optionService.listAndCount(
    filterableFields,
    listConfig
  )

  const options = await pricingService.setShippingOptionPrices(data)

  res.status(200).json({
    shipping_options: options,
    count,
    offset: listConfig.skip,
    limit: listConfig.take,
  })
}

/**
 * Parameters used to filter the retrieved shipping options.
 */
export class AdminGetShippingOptionsParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
  /**
   * IDs to filter shipping options by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Name to filter shipping options by.
   */
  @IsOptional()
  @IsString()
  name?: string

  /**
   * Filter by a region ID.
   */
  @IsOptional()
  @IsString()
  region_id?: string

  /**
   * Filter by whether the shipping option is used for returns or orders.
   */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  is_return?: boolean

  /**
   * Filter by whether the shipping options are available for admin users only.
   */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  admin_only?: boolean

  /**
   * Filter shipping options by a search query.
   */
  @IsOptional()
  @IsString()
  q?: string

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsOptional()
  @IsString()
  order?: string

  /**
   * Date filters to apply on shipping options' `created_at` field.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on shipping options' `updated_at` field.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  /**
   * Date filters to apply on shipping options' `deleted_at` field.
   */
  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator

  /**
   * Comma-separated fields that should be included in the returned shipping options.
   */
  @IsOptional()
  @IsString()
  fields?: string

  /**
   * Comma-separated relations that should be expanded in the returned shipping options.
   */
  @IsOptional()
  @IsString()
  expand?: string
}
