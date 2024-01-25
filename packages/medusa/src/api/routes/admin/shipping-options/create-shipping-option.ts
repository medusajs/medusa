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
import { RequirementType, ShippingOptionPriceType } from "../../../../models"

import { Type } from "class-transformer"
import { EntityManager } from "typeorm"
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"
import { ShippingOptionService } from "../../../../services"
import { CreateShippingOptionInput } from "../../../../types/shipping-options"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/shipping-options
 * operationId: "PostShippingOptions"
 * summary: "Create Shipping Option"
 * description: "Create a Shipping Option."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostShippingOptionsReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.shippingOptions.create({
 *         name: "PostFake",
 *         region_id,
 *         provider_id,
 *         data: {
 *         },
 *         price_type: "flat_rate"
 *       })
 *       .then(({ shipping_option }) => {
 *         console.log(shipping_option.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminCreateShippingOption } from "medusa-react"
 *
 *       type CreateShippingOption = {
 *         name: string
 *         provider_id: string
 *         data: Record<string, unknown>
 *         price_type: string
 *         amount: number
 *       }
 *
 *       type Props = {
 *         regionId: string
 *       }
 *
 *       const Region = ({ regionId }: Props) => {
 *         const createShippingOption = useAdminCreateShippingOption()
 *         // ...
 *
 *         const handleCreate = (
 *           data: CreateShippingOption
 *         ) => {
 *           createShippingOption.mutate({
 *             ...data,
 *             region_id: regionId
 *           }, {
 *             onSuccess: ({ shipping_option }) => {
 *               console.log(shipping_option.id)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default Region
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/shipping-options' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "PostFake",
 *           "region_id": "afasf",
 *           "provider_id": "manual",
 *           "data": {},
 *           "price_type": "flat_rate"
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
  const validated = await validator(AdminPostShippingOptionsReq, req.body)

  const optionService: ShippingOptionService = req.scope.resolve(
    "shippingOptionService"
  )
  const shippingProfileService = req.scope.resolve("shippingProfileService")

  // Add to default shipping profile
  if (!validated.profile_id) {
    const { id } = await shippingProfileService.retrieveDefault()
    validated.profile_id = id
  }

  const manager: EntityManager = req.scope.resolve("manager")
  const result = await manager.transaction(async (transactionManager) => {
    return await optionService
      .withTransaction(transactionManager)
      .create(validated as CreateShippingOptionInput)
  })

  const data = await optionService.retrieve(result.id, {
    select: shippingOptionsDefaultFields,
    relations: shippingOptionsDefaultRelations,
  })

  res.status(200).json({ shipping_option: data })
}

class OptionRequirement {
  @IsEnum(RequirementType, {
    message: `Invalid option type, must be one of "min_subtotal" or "max_subtotal"`,
  })
  type: RequirementType

  @IsNumber()
  amount: number
}

/**
 * @schema AdminPostShippingOptionsReq
 * type: object
 * description: "The details of the shipping option to create."
 * required:
 *   - name
 *   - region_id
 *   - provider_id
 *   - data
 *   - price_type
 * properties:
 *   name:
 *     description: "The name of the Shipping Option"
 *     type: string
 *   region_id:
 *     description: "The ID of the Region in which the Shipping Option will be available."
 *     type: string
 *   provider_id:
 *     description: "The ID of the Fulfillment Provider that handles the Shipping Option."
 *     type: string
 *   profile_id:
 *     description: "The ID of the Shipping Profile to add the Shipping Option to."
 *     type: number
 *   data:
 *     description: "The data needed for the Fulfillment Provider to handle shipping with this Shipping Option."
 *     type: object
 *   price_type:
 *     description: >-
 *       The type of the Shipping Option price. `flat_rate` indicates fixed pricing, whereas `calculated` indicates that the price will be calculated each time by the fulfillment provider.
 *     type: string
 *     enum:
 *       - flat_rate
 *       - calculated
 *   amount:
 *     description: >-
 *       The amount to charge for the Shipping Option. If the `price_type` is set to `calculated`, this amount will not actually be used.
 *     type: integer
 *   requirements:
 *     description: "The requirements that must be satisfied for the Shipping Option to be available."
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - type
 *         - amount
 *       properties:
 *         type:
 *           description: The type of the requirement
 *           type: string
 *           enum:
 *             - max_subtotal
 *             - min_subtotal
 *         amount:
 *           description: The amount to compare with.
 *           type: integer
 *   is_return:
 *     description: Whether the Shipping Option can be used for returns or during checkout.
 *     type: boolean
 *     default: false
 *   admin_only:
 *     description: >-
 *       If set to `true`, the shipping option can only be used when creating draft orders.
 *     type: boolean
 *     default: false
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 *   includes_tax:
 *     description: "Tax included in prices of shipping option"
 *     x-featureFlag: "tax_inclusive_pricing"
 *     type: boolean
 */
export class AdminPostShippingOptionsReq {
  @IsString()
  name: string

  @IsString()
  region_id: string

  @IsString()
  provider_id: string

  @IsString()
  @IsOptional()
  profile_id?: string

  @IsObject()
  data: Record<string, unknown>

  @IsEnum(ShippingOptionPriceType, {
    message: `Invalid price type, must be one of "flat_rate" or "calculated"`,
  })
  price_type: ShippingOptionPriceType

  @IsOptional()
  @IsNumber()
  amount?: number

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionRequirement)
  requirements?: OptionRequirement[]

  @IsOptional()
  @Type(() => Boolean)
  admin_only?: boolean = false

  @IsOptional()
  @Type(() => Boolean)
  is_return?: boolean = false

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>

  @FeatureFlagDecorators(TaxInclusivePricingFeatureFlag.key, [
    IsOptional(),
    IsBoolean(),
  ])
  includes_tax?: boolean
}
