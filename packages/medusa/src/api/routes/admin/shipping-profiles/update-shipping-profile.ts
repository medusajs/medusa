import { IsOptional, IsString } from "class-validator"

import { EntityManager } from "typeorm"
import { ShippingProfileService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /shipping-profiles/{id}
 * operationId: "PostShippingProfilesProfile"
 * summary: "Update a Shipping Profiles"
 * description: "Updates a Shipping Profile"
 * parameters:
 *   - (path) id=* {string} The ID of the Shipping Profile.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           name:
 *             description: "The name of the Shipping Profile"
 *             type: string
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
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'localhost:9000/admin/shipping-profiles/{id} \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "Large Products"
 *       }'
 * tags:
 *   - Shipping Profile
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             shipping_profile:
 *               $ref: "#/components/schemas/shipping_profile"
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

  const data = await profileService.retrieve(profile_id)
  res.status(200).json({ shipping_profile: data })
}

export class AdminPostShippingProfilesProfileReq {
  @IsString()
  @IsOptional()
  name?: string
}
