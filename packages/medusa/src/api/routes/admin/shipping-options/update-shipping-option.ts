import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultFields, defaultRelations } from "."

import { Type } from "class-transformer"
import { EntityManager } from "typeorm"
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { validator } from "../../../../utils/validator"
import { ShippingOptionService } from "../../../../services"
import { UpdateShippingOptionInput } from "../../../../types/shipping-options"

/**
 * @oas [post] /admin/shipping-options/{id}
 * operationId: "PostShippingOptionsOption"
 * summary: "Update Shipping Option"
 * description: "Updates a Shipping Option"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Shipping Option.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostShippingOptionsOptionReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.shippingOptions.update(option_id, {
 *         name: 'PostFake',
 *         requirements: [
 *           {
 *             id,
 *             type: 'max_subtotal',
 *             amount: 1000
 *           }
 *         ]
 *       })
 *       .then(({ shipping_option }) => {
 *         console.log(shipping_option.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/shipping-options/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "requirements": [
 *             {
 *               "type": "max_subtotal",
 *               "amount": 1000
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Shipping Options
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminShippingOptionsRes"
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
  const { option_id } = req.params

  const validated = (await validator(
    AdminPostShippingOptionsOptionReq,
    req.body
  )) as UpdateShippingOptionInput

  const optionService: ShippingOptionService = req.scope.resolve(
    "shippingOptionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await optionService
      .withTransaction(transactionManager)
      .update(option_id, validated)
  })

  const data = await optionService.retrieve(option_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ shipping_option: data })
}

class OptionRequirement {
  @IsString()
  @IsOptional()
  id: string
  @IsString()
  type: string
  @IsNumber()
  amount: number
}

/**
 * @schema AdminPostShippingOptionsOptionReq
 * type: object
 * required:
 *   - requirements
 * properties:
 *   name:
 *     description: "The name of the Shipping Option"
 *     type: string
 *   amount:
 *     description: "The amount to charge for the Shipping Option."
 *     type: integer
 *   admin_only:
 *     description: "If true, the option can be used for draft orders"
 *     type: boolean
 *   metadata:
 *     description: "An optional set of key-value pairs with additional information."
 *     type: object
 *   requirements:
 *     description: "The requirements that must be satisfied for the Shipping Option to be available."
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - type
 *         - amount
 *       properties:
 *         id:
 *           description: The ID of the requirement
 *           type: string
 *         type:
 *           description: The type of the requirement
 *           type: string
 *           enum:
 *             - max_subtotal
 *             - min_subtotal
 *         amount:
 *           description: The amount to compare with.
 *           type: integer
 *   includes_tax:
 *     description: "[EXPERIMENTAL] Tax included in prices of shipping option"
 *     type: boolean
 */
export class AdminPostShippingOptionsOptionReq {
  @IsString()
  @IsOptional()
  name: string

  @IsNumber()
  @IsOptional()
  amount?: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionRequirement)
  requirements: OptionRequirement[]

  @IsBoolean()
  @IsOptional()
  admin_only?: boolean

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>

  @FeatureFlagDecorators(TaxInclusivePricingFeatureFlag.key, [
    IsOptional(),
    IsBoolean(),
  ])
  includes_tax?: boolean
}
