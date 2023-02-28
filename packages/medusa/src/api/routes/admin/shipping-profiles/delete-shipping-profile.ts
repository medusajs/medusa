import { EntityManager } from "typeorm"
import { ShippingProfileService } from "../../../../services"

/**
 * @oas [delete] /admin/shipping-profiles/{id}
 * operationId: "DeleteShippingProfilesProfile"
 * summary: "Delete a Shipping Profile"
 * description: "Deletes a Shipping Profile."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Shipping Profile.
 * x-codegen:
 *   method: delete
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.shippingProfiles.delete(profile_id)
 *       .then(({ id, object, deleted }) => {
 *         console.log(id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/shipping-profiles/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
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
 *           $ref: "#/components/schemas/AdminDeleteShippingProfileRes"
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
  const profileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await profileService
      .withTransaction(transactionManager)
      .delete(profile_id)
  })

  res.status(200).json({
    id: profile_id,
    object: "shipping_profile",
    deleted: true,
  })
}
