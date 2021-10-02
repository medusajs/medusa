/**
 * @oas [delete] /claim-reason/{id}
 * operationId: "DeleteClaimReason"
 * summary: "Delete a claim reason"
 * description: "Deletes a claim reason."
 * parameters:
 *   - (path) id=* {string} The id of the claim reason
 * tags:
 *   - Claim Reason
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The id of the deleted claim reason
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { id } = req.params

  try {
    const claimReasonService = req.scope.resolve("claimReasonService")
    await claimReasonService.delete(id)

    res.json({
      id: id,
      object: "claim_reason",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}
