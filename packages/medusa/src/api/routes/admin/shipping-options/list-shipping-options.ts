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
 * tags:
 *   - Shipping Option
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             shipping_options:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/shipping_option"
 *             count:
 *               type: integer
 *               description: The total number of items available
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
