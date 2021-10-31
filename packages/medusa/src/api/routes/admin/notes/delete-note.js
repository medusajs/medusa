/**
 * @oas [delete] /notes/{id}
 * operationId: "DeleteNotesNote"
 * summary: "Deletes a Note"
 * description: "Deletes a Note."
 * parameters:
 *   - (path) id=* {string} The id of the Note to delete.
 * tags:
 *   - Note
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The id of the deleted Note.
 *             deleted:
 *               type: boolean
 *               description: Whether or not the Note was deleted.
 */
export default async (req, res) => {
  const { id } = req.params

  const noteService = req.scope.resolve("noteService")
  await noteService.delete(id)

  res.status(200).json({ id, deleted: true })
}
