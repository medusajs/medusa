import NoteService from "../../../../services/note"

/**
 * @oas [delete] /notes/{id}
 * operationId: "DeleteNotesNote"
 * summary: "Deletes a Note"
 * description: "Deletes a Note."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Note to delete.
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
 *               description: The ID of the deleted Note.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 *               description: Whether or not the Note was deleted.
 */
export default async (req, res) => {
  const { id } = req.params

  const noteService: NoteService = req.scope.resolve("noteService")
  await noteService.delete(id)

  res.status(200).json({ id, object: "note", deleted: true })
}
