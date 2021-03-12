import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /shipping-profiles/{id}
 * operationId: "PostShippingProfilesProfile"
 * summary: "Update a Shipping Profiles"
 * description: "Updates a Shipping Profile"
 * parameters:
 *   - (path) id=* {string} The id of the Shipping Profile.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           name:
 *             description: "The name of the Shipping Profile"
 *             type: string
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
 *               $ref: "#/components/schemas/shipping_profile"
 */
export default async (req, res) => {
  const { profile_id } = req.params

  const schema = Validator.object().keys({
    name: Validator.string(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const profileService = req.scope.resolve("shippingProfileService")

    await profileService.update(profile_id, value)

    const data = await profileService.retrieve(profile_id)
    res.status(200).json({ shipping_profile: data })
  } catch (err) {
    throw err
  }
}
