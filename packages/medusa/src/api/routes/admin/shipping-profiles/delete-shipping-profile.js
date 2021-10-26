/**
 * @oas [delete] /shipping-profiles/{id}
 * operationId: "DeleteShippingProfilesProfile"
 * summary: "Delete a Shipping Profile"
 * description: "Deletes a Shipping Profile."
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
 *             id:
 *               type: string
 *               description: The id of the deleted Shipping Profile.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { profile_id } = req.params
  const profileService = req.scope.resolve("shippingProfileService")

  await profileService.delete(profile_id)

  res.status(200).json({
    id: profile_id,
    object: "shipping_profile",
    deleted: true,
  })
}
