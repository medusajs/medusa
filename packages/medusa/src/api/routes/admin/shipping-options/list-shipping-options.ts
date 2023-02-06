import { IsBoolean, IsOptional, IsString } from "class-validator"
import { defaultFields, defaultRelations } from "."

import { PricingService } from "../../../../services"
import { Transform } from "class-transformer"
import { optionalBooleanMapper } from "../../../../utils/validators/is-boolean"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /shipping-options
 * operationId: "GetShippingOptions"
 * summary: "List Shipping Options"
 * description: "Retrieves a list of Shipping Options."
 * x-authenticated: true
 * parameters:
 *  - in: query
 *    name: region_id
 *    schema:
 *      type: string
 *    description: Region ID to fetch options from
 *  - in: query
 *    name: is_return
 *    schema:
 *      type: boolean
 *    description: Flag for fetching return options only
 *  - in: query
 *    name: admin_only
 *    schema:
 *      type: boolean
 *    description: Flag for fetching admin specific options
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
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/shipping-options' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Shipping Option
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

export class AdminGetShippingOptionsParams {
  @IsOptional()
  @IsString()
  region_id?: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  is_return?: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  admin_only?: boolean
}
