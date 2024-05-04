import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import {
  shippingOptionsDefaultFields,
  shippingOptionsDefaultRelations,
} from "."

import { Type } from "class-transformer"
import { EntityManager } from "typeorm"
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"
import { ShippingOptionPriceType } from "../../../../models"
import { ShippingOptionService } from "../../../../services"
import { UpdateShippingOptionInput } from "../../../../types/shipping-options"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/shipping-options/{id}
 * operationId: "PostShippingOptionsOption"
 * summary: "Update Shipping Option"
 * description: "Update a Shipping Option's details."
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
 *       medusa.admin.shippingOptions.update(optionId, {
 *         name: "PostFake",
 *         requirements: [
 *           {
 *             id,
 *             type: "max_subtotal",
 *             amount: 1000
 *           }
 *         ]
 *       })
 *       .then(({ shipping_option }) => {
 *         console.log(shipping_option.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminUpdateShippingOption } from "medusa-react"
 *
 *       type Props = {
 *         shippingOptionId: string
 *       }
 *
 *       const ShippingOption = ({ shippingOptionId }: Props) => {
 *         const updateShippingOption = useAdminUpdateShippingOption(
 *           shippingOptionId
 *         )
 *         // ...
 *
 *         const handleUpdate = (
 *           name: string,
 *           requirements: {
 *             id: string,
 *             type: string,
 *             amount: number
 *           }[]
 *         ) => {
 *           updateShippingOption.mutate({
 *             name,
 *             requirements
 *           }, {
 *             onSuccess: ({ shipping_option }) => {
 *               console.log(shipping_option.requirements)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default ShippingOption
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/shipping-options/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
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
 *   - jwt_token: []
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
    select: shippingOptionsDefaultFields,
    relations: shippingOptionsDefaultRelations,
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
 * description: "The details to update of the shipping option."
 * required:
 *   - requirements
 * properties:
 *   name:
 *     description: "The name of the Shipping Option"
 *     type: string
 *   amount:
 *     description: >-
 *       The amount to charge for the Shipping Option. If the `price_type` of the shipping option is `calculated`, this amount will not actually be used.
 *     type: integer
 *   admin_only:
 *     description: >-
 *       If set to `true`, the shipping option can only be used when creating draft orders.
 *     type: boolean
 *   metadata:
 *     description: "An optional set of key-value pairs with additional information."
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
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
 *           description: The ID of an existing requirement. If an ID is passed, the existing requirement's details are updated. Otherwise, a new requirement is created.
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
 *     description: "Tax included in prices of shipping option"
 *     x-featureFlag: "tax_inclusive_pricing"
 *     type: boolean
 */
export class AdminPostShippingOptionsOptionReq {
  @IsString()
  @IsOptional()
  name: string

  @IsNumber()
  @IsOptional()
  amount?: number

  @IsEnum(ShippingOptionPriceType, {
    message: `Invalid price type, must be one of "flat_rate" or "calculated"`,
  })
  @IsOptional()
  price_type?: ShippingOptionPriceType

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
