import { defaultFields, defaultRelations } from "./"

/**
 * @oas [get] /shipping-profiles/{id}
 * operationId: "GetShippingProfilesProfile"
 * summary: "Retrieve a Shipping Profile"
 * description: "Retrieves a Shipping Profile."
 * parameters:
 *   - (path) id=* {string} The id of the Shipping Profile.
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
  try {
    const profileService = req.scope.resolve("shippingProfileService")

    const profile = await profileService.retrieve(profile_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ shipping_profile: profile })
  } catch (err) {
    throw err
  }
}
