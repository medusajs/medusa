import {
  defaultAdminShippingProfilesFields,
  defaultAdminShippingProfilesRelations,
} from "."

import { ShippingProfileService } from "../../../../services"

/**
 * @oas [get] /shipping-profiles/{id}
 * operationId: "GetShippingProfilesProfile"
 * summary: "Retrieve a Shipping Profile"
 * description: "Retrieves a Shipping Profile."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Shipping Profile.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in
 *       medusa.admin.shippingProfiles.retrieve(profile_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'localhost:9000/admin/shipping-profiles/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
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
  const profileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )

  const profile = await profileService.retrieve(profile_id, {
    select: defaultAdminShippingProfilesFields,
    relations: defaultAdminShippingProfilesRelations,
  })

  res.status(200).json({ shipping_profile: profile })
}
