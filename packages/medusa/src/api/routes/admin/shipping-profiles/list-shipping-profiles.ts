import { ShippingProfileService } from "../../../../services"

/**
 * @oas [get] /shipping-profiles
 * operationId: "GetShippingProfiles"
 * summary: "List Shipping Profiles"
 * description: "Retrieves a list of Shipping Profile."
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.shippingProfiles.list()
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'localhost:9000/admin/shipping-profiles' \
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
 *             shipping_profiles:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/shipping_profile"
 */
export default async (req, res) => {
  const profileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )

  const data = await profileService.list()

  res.status(200).json({ shipping_profiles: data })
}
