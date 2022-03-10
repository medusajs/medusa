import { Transform } from "class-transformer"
import { IsBoolean, IsOptional, IsString } from "class-validator"
import { defaultFields, defaultRelations } from "."
import { validator } from "../../../../utils/validator"
import { optionalBooleanMapper } from "../../../../utils/validators/is-boolean"

/**
 * @oas [get] /shipping-options
 * operationId: "GetShippingOptions"
 * summary: "List Shipping Options"
 * description: "Retrieves a list of Shipping Options."
 * x-authenticated: true
 * parameters:
 *  - in: path
 *    name: region_id
 *    schema:
 *      type: string
 *    required: false
 *    description: Region to fetch options from
 *  - in: path
 *    name: is_return
 *    schema:
 *      type: boolean
 *    required: false
 *    description: Flag for fetching return options
 *  - in: path
 *    name: admin_only
 *    schema:
 *      type: boolean
 *    required: false
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
 */
export default async (req, res) => {
  const validatedParams = await validator(
    AdminGetShippingOptionsParams,
    req.query
  )

  const optionService = req.scope.resolve("shippingOptionService")
  const [data, count] = await optionService.listAndCount(validatedParams, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ shipping_options: data, count })
}

export class AdminGetShippingOptionsParams {
  @IsOptional()
  @IsString()
  region_id?: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  is_return?: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  admin_only?: string
}
