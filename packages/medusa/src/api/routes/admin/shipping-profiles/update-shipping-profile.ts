import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"

import { EntityManager } from "typeorm"
import { ShippingProfileType } from "../../../../models"
import { ShippingProfileService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import {
  defaultAdminShippingProfilesFields,
  defaultAdminShippingProfilesRelations,
} from "."

/**
 * @oas [post] /admin/shipping-profiles/{id}
 * operationId: "PostShippingProfilesProfile"
 * summary: "Update a Shipping Profile"
 * description: "Updates a Shipping Profile"
 * parameters:
 *   - (path) id=* {string} The ID of the Shipping Profile.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostShippingProfilesProfileReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.shippingProfiles.update(shipping_profile_id, {
 *         name: 'Large Products'
 *       })
 *       .then(({ shipping_profile }) => {
 *         console.log(shipping_profile.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/shipping-profiles/{id} \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "Large Products"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Shipping Profiles
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminShippingProfilesRes"
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
  const { profile_id } = req.params

  const validated = await validator(
    AdminPostShippingProfilesProfileReq,
    req.body
  )

  const profileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await profileService
      .withTransaction(transactionManager)
      .update(profile_id, validated)
  })

  const data = await profileService.retrieve(profile_id, {
    select: defaultAdminShippingProfilesFields,
    relations: defaultAdminShippingProfilesRelations,
  })

  res.status(200).json({ shipping_profile: data })
}

/**
 * @schema AdminPostShippingProfilesProfileReq
 * type: object
 * properties:
 *   name:
 *     description: The name of the Shipping Profile
 *     type: string
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 *   type:
 *     description: The type of the Shipping Profile
 *     type: string
 *     enum: [default, gift_card, custom]
 *   products:
 *     description: An optional array of product ids to associate with the Shipping Profile
 *     type: array
 *   shipping_options:
 *     description: An optional array of shipping option ids to associate with the Shipping Profile
 *     type: array
 */
export class AdminPostShippingProfilesProfileReq {
  @IsString()
  @IsOptional()
  name?: string

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>

  @IsOptional()
  @IsEnum(ShippingProfileType, {
    message: "type must be one of 'default', 'custom', 'gift_card'",
  })
  type?: ShippingProfileType

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  shipping_options?: string[]
}
