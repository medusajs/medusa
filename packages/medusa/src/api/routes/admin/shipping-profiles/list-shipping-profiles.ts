import { ShippingProfileService } from "../../../../services"

/**
 * @oas [get] /shipping-profiles
 * operationId: "GetShippingProfiles"
 * summary: "List Shipping Profiles"
 * description: "Retrieves a list of Shipping Profile."
 * x-authenticated: true
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
