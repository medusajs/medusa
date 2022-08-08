import { EntityManager } from "typeorm"
import { ShippingProfileService } from "../../../../services"

/**
 * @oas [delete] /shipping-profiles/{id}
 * operationId: "DeleteShippingProfilesProfile"
 * summary: "Delete a Shipping Profile"
 * description: "Deletes a Shipping Profile."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Shipping Profile.
 * tags:
 *   - Shipping Profile
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted Shipping Profile.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: shipping_profile
 *             deleted:
 *               type: boolean
 *               description: Whether or not the items were deleted.
 *               default: true
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
