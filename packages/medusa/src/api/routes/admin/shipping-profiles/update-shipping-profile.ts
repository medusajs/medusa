import { IsOptional, IsString } from "class-validator"
import { ShippingProfileService } from "../../../../services"
import { validator } from "../../../../utils/validator"

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

  const validated = await validator(
    AdminPostShippingProfilesProfileReq,
    req.body
  )

  const profileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )

  await profileService.update(profile_id, validated)

  const data = await profileService.retrieve(profile_id)
  res.status(200).json({ shipping_profile: data })
}

export class AdminPostShippingProfilesProfileReq {
  @IsString()
  @IsOptional()
  name?: string
}
