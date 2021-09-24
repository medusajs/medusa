/**
 * @oas [delete] /return-reason/{id}
 * operationId: "DeleteReturnReason"
 * summary: "Delete a return reason"
 * description: "Deletes a return reason."
 * parameters:
 *   - (path) id=* {string} The id of the return reason
 * tags:
 *   - Return Reason
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The id of the deleted return reason
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { id } = req.params

  try {
    const returnReasonService = req.scope.resolve("returnReasonService")
    await returnReasonService.delete(id)

    res.json({
      id: id,
      object: "return_reason",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}
