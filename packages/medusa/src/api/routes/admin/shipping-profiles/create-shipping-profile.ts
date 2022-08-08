import { EntityManager } from "typeorm"
import { IsString } from "class-validator"
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
 *         required:
 *           - name
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
 *       // must be previously logged in
 *       medusa.admin.shippingProfiles.create({
 *         name: 'Large Products'
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'localhost:9000/admin/shipping-profiles' \
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

export class AdminPostShippingProfilesReq {
  @IsString()
  name: string
}
