import { IsBoolean, IsOptional, IsString } from "class-validator"
import { defaultFields, defaultRelations } from "."

import { PricingService } from "../../../../services"
import { Transform } from "class-transformer"
import { optionalBooleanMapper } from "../../../../utils/validators/is-boolean"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /admin/shipping-options
 * operationId: "GetShippingOptions"
 * summary: "List Shipping Options"
 * description: "Retrieve a list of Shipping Options. The shipping options can be filtered by fields such as `region_id` or `is_return`."
 * x-authenticated: true
 * parameters:
 *  - in: query
 *    name: region_id
 *    schema:
 *      type: string
 *    description: Filter by a region ID.
 *  - in: query
 *    name: is_return
 *    description: Filter by whether the shipping option is used for returns or orders.
 *    schema:
 *      type: boolean
 *  - in: query
 *    name: admin_only
 *    schema:
 *      type: boolean
 *    description: Filter by whether the shipping option is used only by admins or not.
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
export default async (req, res) => {
  const validatedParams = await validator(
    AdminGetShippingOptionsParams,
    req.query
  )

  const optionService = req.scope.resolve("shippingOptionService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const [data, count] = await optionService.listAndCount(validatedParams, {
    select: defaultFields,
    relations: defaultRelations,
  })

  const options = await pricingService.setShippingOptionPrices(data)

  res.status(200).json({ shipping_options: options, count })
}

/**
 * Parameters used to filter the retrieved shipping options.
 */
export class AdminGetShippingOptionsParams {
  /**
   * Filter shipping options by the ID of the region they belong to.
   */
  @IsOptional()
  @IsString()
  region_id?: string

  /**
   * Filter shipping options by whether they're return shipping options.
   */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  is_return?: boolean

  /**
   * Filter shipping options by whether they're available for admin users only.
   */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  admin_only?: boolean
}
