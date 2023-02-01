import { IsEnum, IsObject, IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"
import { ShippingProfileType } from "../../../../models"
import { ShippingProfileService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /shipping-profiles
 * operationId: "PostShippingProfiles"
 * summary: "Create a Shipping Profile"
 * description: "Creates a Shipping Profile"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostShippingProfilesReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.shippingProfiles.create({
 *         name: 'Large Products'
 *       })
 *       .then(({ shipping_profile }) => {
 *         console.log(shipping_profile.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/shipping-profiles' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "Large Products"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Shipping Profile
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
  const validated = await validator(AdminPostShippingProfilesReq, req.body)

  const profileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )
  const manager: EntityManager = req.scope.resolve("manager")
  const data = await manager.transaction(async (transactionManager) => {
    return await profileService
      .withTransaction(transactionManager)
      .create(validated)
  })

  res.status(200).json({ shipping_profile: data })
}

/**
 * @schema AdminPostShippingProfilesReq
 * type: object
 * required:
 *   - name
 *   - type
 * properties:
 *   name:
 *     description: The name of the Shipping Profile
 *     type: string
 *   type:
 *     description: The type of the Shipping Profile
 *     type: string
 *     enum: [default, gift_card, custom]
 */
export class AdminPostShippingProfilesReq {
  @IsString()
  name: string

  @IsEnum(ShippingProfileType, {
    message: "type must be one of 'default', 'custom', 'gift_card'",
  })
  type: ShippingProfileType

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>
}
